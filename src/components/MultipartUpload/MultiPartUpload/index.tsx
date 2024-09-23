import React, { useState } from "react";
import UploadFiles from "./FilesUploadingPart";
import {
  FileError,
  FileFormData,
  FilePreview,
  FileProgress,
  PresignedUrlsResponse,
  UploadFileResponse,
} from "@/lib/interfaces";
import {
  bytesToMB,
  calculateChunks,
  generateVideoThumbnail,
  previewImagesEvent,
} from "@/lib/helpers/uploadHelpers";
import {
  abortUploadingAPI,
  getPresignedUrlsForFileAPI,
  mergeAllChunksAPI,
  resumeUploadAPI,
  startUploadMultipartFileAPI,
} from "@/lib/services/multipart";

const MultiPartUploadComponent: React.FC = () => {
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [abortedFiles, setAbortedFiles] = useState<Set<number>>(new Set());
  const [fileProgress, setFileProgress] = useState<FileProgress>({});
  const [previewImages, setPreviewImages] = useState<FilePreview[]>([]);
  const [fileErrors, setFileErrors] = useState<FileError[]>([]);
  const [fileFormData, setFileFormData] = useState<FileFormData>({
    chunkSize: "",
    unit: "MB",
    totalChunksParts: "",
    chunkSizeInBytes: 0,
  });
  const [uploadFileDetails, setUploadFileDetails] = useState<any>([]);
  const [presignedUrlsMap, setPresignedUrlsMap] = useState<{
    [index: number]: string[];
  }>({});

  const handleFileChange = async (files: File[]) => {
    const newFiles: any = Array.from(files);
    const combinedFiles = [...newFiles, ...multipleFiles];

    setMultipleFiles(combinedFiles);
    setFileProgress((prev) => ({
      ...prev,
      ...Object.fromEntries(
        newFiles.map((_: any, index: number) => [index, 0])
      ),
    }));
    setFileErrors([]);

    for (const [index, file] of newFiles.entries()) {
      try {
        if (file.type.startsWith("video")) {
          generateVideoThumbnail(file, previewImages, setPreviewImages);
        } else if (file.type.startsWith("image")) {
          previewImagesEvent(file, previewImages, setPreviewImages);
        }

        const { chunkSize, totalChunks } = calculateChunks(file.size);
        setFileFormData((prev) => ({
          ...prev,
          chunkSize: chunkSize.toString(),
          totalChunksParts: totalChunks.toString(),
          chunkSizeInBytes: chunkSize,
        }));

        await startUploadEvent(file, index, chunkSize, totalChunks);
      } catch (error) {
        setFileErrors((prev) => [
          ...prev,
          { file, reason: (error as Error).message },
        ]);
      }
    }
  };

  const startUploadEvent = async (
    file: File,
    index: number,
    chunkSize: number,
    totalChunks: number
  ) => {
    try {
      const response: UploadFileResponse = await startUploadMultipartFileAPI({
        original_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_path: file.name,
      });

      if (response?.success) {
        const { upload_id, file_key } = response.data;
        setUploadFileDetails((prev: any) => [
          ...prev,
          {
            upload_id,
            file_key,
            original_name: file.name,
            name: file.name,
            path: file.name,
          },
        ]);
        await uploadFileIntoChunks(
          upload_id,
          file,
          index,
          file_key,
          chunkSize,
          totalChunks
        );
      } else {
        throw new Error("Failed to start upload");
      }
    } catch (error) {
      setFileErrors((prev) => [
        ...prev,
        { file, reason: (error as Error).message },
      ]);
    }
  };

  const fetchPresignedUrls = async (
    fileIndex: number,
    uploadId: string,
    key: string,
    totalChunks: number
  ) => {
    if (presignedUrlsMap[fileIndex]) {
      return presignedUrlsMap[fileIndex];
    }

    const response: PresignedUrlsResponse = await getPresignedUrlsForFileAPI({
      file_key: key,
      upload_id: uploadId,
      parts: totalChunks,
    });

    if (!response.success) {
      throw new Error("Failed to get presigned URLs");
    }

    const presignedUrls = response.data;
    setPresignedUrlsMap((prev) => ({ ...prev, [fileIndex]: presignedUrls }));
    return presignedUrls;
  };

  const uploadFileIntoChunks = async (
    uploadId: string,
    file: File,
    index: number,
    key: string,
    chunkSize: number,
    totalChunks: number,
    unuploadedParts?: number[] | any
  ) => {
    const etags: { ETag: string; PartNumber: number }[] = [];

    try {
      const presignedUrls = await fetchPresignedUrls(
        index,
        uploadId,
        key,
        totalChunks
      );

      const uploadPromises = Array.from({ length: totalChunks }).map(
        async (_, chunkIndex) => {
          const start = chunkIndex * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          const chunk = file.slice(start, end);
          const url = presignedUrls[chunkIndex];

          try {
            const res = await fetch(url, {
              method: "PUT",
              body: chunk,
            });
            if (!res.ok) {
              throw new Error(`Failed to upload chunk ${chunkIndex + 1}`);
            }
            const etag = res.headers.get("Etag")?.replace(/"/g, "") || "";
            etags.push({ ETag: etag, PartNumber: chunkIndex + 1 });

            const progress = (((chunkIndex + 1) / totalChunks) * 100).toFixed(
              2
            );
            setFileProgress((prev) => ({
              ...prev,
              [index]: parseFloat(progress),
            }));
          } catch (err) {
            setFileErrors((prev) => [
              ...prev,
              { file, reason: (err as Error).message },
            ]);
          }
        }
      );

      await Promise.all(uploadPromises);

      await mergeFileChunks(uploadId, key, etags, index);
      setPresignedUrlsMap((prev) => {
        const newMap = { ...prev };
        delete newMap[index];
        return newMap;
      });
    } catch (error) {
      setFileErrors((prev) => [
        ...prev,
        { file, reason: (error as Error).message },
      ]);
    }
  };

  const mergeFileChunks = async (
    uploadId: string,
    fileKey: string,
    etags: { ETag: string; PartNumber: number }[],
    index: number
  ) => {
    const sortedEtags = etags
      .slice()
      .sort((a, b) => a.PartNumber - b.PartNumber);

    try {
      const response = await mergeAllChunksAPI({
        file_key: fileKey,
        upload_id: uploadId,
        parts: sortedEtags,
      });
      if (!response.success) {
        setFileProgress((prev) => ({ ...prev, [index]: 99 }));
        throw new Error("Failed to merge chunks");
      } else {
        setFileProgress((prev) => ({ ...prev, [index]: 100 }));
      }
    } catch (error) {
      setFileErrors((prev) => [
        ...prev,
        { file: { name: fileKey } as File, reason: (error as Error).message },
      ]);
    }
  };

  const resumeUpload = async (file: File, index: number) => {
    const body = {
      upload_id: uploadFileDetails[0]?.upload_id,
      file_key: uploadFileDetails[0]?.file_key,
      parts: +fileFormData.totalChunksParts,
    };
    try {
      const response = await resumeUploadAPI(body);
      if (!response.success) {
        throw new Error("Failed to resume upload");
      }
      const unuploadedParts = response.data || [];
      await uploadFileIntoChunks(
        uploadFileDetails[0]?.upload_id,
        file,
        index,
        uploadFileDetails[0]?.file_key,
        +fileFormData.chunkSizeInBytes,
        +fileFormData.totalChunksParts,
        unuploadedParts
      );
    } catch (error) {
      console.error(error);
    }
  };

  const abortFileUpload = async (index: number) => {
    const body = {
      upload_id: uploadFileDetails[0]?.upload_id,
      file_key: uploadFileDetails[0]?.file_key,
    };
    try {
      const response = await abortUploadingAPI(body);
      if (!response.success) {
        throw new Error("Failed to abort upload");
      }
      setAbortedFiles((prev) => new Set(prev.add(index)));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <UploadFiles
        handleFileChange={handleFileChange}
        multipleFiles={multipleFiles}
        previewImages={previewImages}
        fileProgress={fileProgress}
        fileErrors={fileErrors}
        setMultipleFiles={setMultipleFiles}
        setFileFormData={setFileFormData}
        fileFormData={fileFormData}
        setFileProgress={setFileProgress}
        resumeUpload={resumeUpload}
        abortFileUpload={abortFileUpload}
        abortedFiles={abortedFiles}
      />
    </div>
  );
};

export default MultiPartUploadComponent;
