import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storeFilesArray } from "../../Redux/Modules/FileUpload";
import {
  bytesToMB,
  generateVideoThumbnail,
  previewImagesEvent,
} from "../../lib/helpers/uploadHelpers";
import {
  FileError,
  FileFormData,
  FilePreview,
  FileProgress,
  PresignedUrlsResponse,
  UploadFileResponse,
} from "../../lib/interfaces";
import {
  abortUploadingAPI,
  getPresignedUrlsForFileAPI,
  mergeAllChunksAPI,
  resumeUploadAPI,
  startUploadMultipartFileAPI,
} from "../../services/multiPartUpload";
import UploadFiles from "./FilesUploadingPart";

const MultiPartUploadComponent: React.FC = () => {
  const filesFromStore = useSelector((state: any) => state.files?.filesList);
  const dispatch = useDispatch();

  const [multipleFiles, setMultipleFiles] = useState<File[]>(
    filesFromStore || []
  );
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
  const [uploadedEtags, setUploadedEtags] = useState<any>([]);

  const handleFileChange = async (files: File[]) => {
    const newFiles = Array.from(files);
    const combinedFiles = [...newFiles, ...filesFromStore];

    dispatch(storeFilesArray(newFiles));
    setMultipleFiles(combinedFiles);
    setFileProgress((prev) => ({
      ...prev,
      ...Object.fromEntries(newFiles.map((_, index) => [index, 0])),
    }));
    setFileErrors([]);

    for (const [index, file] of newFiles.entries()) {
      try {
        if (file.type.startsWith("video")) {
          generateVideoThumbnail(file, previewImages, setPreviewImages);
        } else if (file.type.startsWith("image")) {
          previewImagesEvent(file, previewImages, setPreviewImages);
        }

        if (bytesToMB(file.size) >= 5) {
          await startUploadEvent(file, index);
        }
      } catch (error) {
        setFileErrors((prev) => [
          ...prev,
          { file, reason: (error as Error).message },
        ]);
      }
    }
  };

  const startUploadEvent = async (file: File, index: number) => {
    try {
      const response: UploadFileResponse = await startUploadMultipartFileAPI({
        original_name: file.name,
        file_type: file.type,
        file_size: file.size,
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
        await uploadFileIntoChunks(upload_id, file, index, file_key);
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

  //todo: refactor
  const uploadFileIntoChunks = async (
    uploadId: string,
    file: File,
    index: number,
    key: string
  ) => {
    const totalChunks = +fileFormData.totalChunksParts;
    const chunkSizeInBytes = +fileFormData.chunkSizeInBytes;

    let uploadedChunks = 0;
    const etags: { ETag: string; PartNumber: number }[] = [];

    try {
      const response: PresignedUrlsResponse = await getPresignedUrlsForFileAPI({
        file_key: key,
        upload_id: uploadId,
        parts: totalChunks,
      });

      if (!response.success) {
        throw new Error("Failed to get presigned URLs");
      }

      const presignedUrls = response.data;

      const uploadPromises = Array.from({ length: totalChunks }).map(
        async (_, chunkIndex) => {
          const start = chunkIndex * chunkSizeInBytes;
          const end = Math.min(start + chunkSizeInBytes, file.size);
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
            uploadedChunks += 1;

            const progress = ((uploadedChunks / totalChunks) * 100).toFixed(2);
            setFileProgress((prev) => ({
              ...prev,
              [index]: parseFloat(progress),
            }));
            setUploadedEtags(etags);
          } catch (err) {
            setFileErrors((prev) => [
              ...prev,
              { file, reason: (err as Error).message },
            ]);
          }
        }
      );

      await Promise.all(uploadPromises);

      if (uploadedChunks === totalChunks) {
        await mergeFileChunks(uploadId, key, etags, index);
      }
    } catch (error) {
      setFileErrors((prev) => [
        ...prev,
        { file, reason: (error as Error).message },
      ]);
    }
  };

  //todo: refactor
  const uploadFileIntoChunksforNotUploaded = async (
    uploadId: string,
    file: File,
    index: number,
    key: string,
    unuploadedParts: any
  ) => {
    setFileErrors([]);
    const totalChunks = +fileFormData.totalChunksParts;
    const chunkSizeInBytes = +fileFormData.chunkSizeInBytes;
    let uploadedChunks: any = 0;
    const etags: { ETag: string; PartNumber: number }[] = [...uploadedEtags];
    try {
      const response: PresignedUrlsResponse = await getPresignedUrlsForFileAPI({
        file_key: key,
        upload_id: uploadId,
        parts: unuploadedParts?.length,
      });
      if (!response.success) {
        throw new Error("Failed to get presigned URLs");
      }
      const presignedUrls = [...response.data];

      uploadedChunks = totalChunks - unuploadedParts?.length;

      const uploadPromises = unuploadedParts.map(
        async (item: any, chunkIndex: number) => {
          const start = (item - 1) * chunkSizeInBytes;
          const end = Math.min(start + chunkSizeInBytes, file.size);
          const chunk = file.slice(start, end);
          const url = presignedUrls[chunkIndex];
          try {
            const res = await fetch(url, {
              method: "PUT",
              body: chunk,
            });
            if (!res.ok) {
              throw new Error(`Failed to upload chunk ${item}`);
            }
            const etag = res.headers.get("Etag")?.replace(/"/g, "") || "";
            etags.push({ ETag: etag, PartNumber: item });

            uploadedChunks += 1;
            const progress = ((uploadedChunks / totalChunks) * 100).toFixed(2);
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
      if (uploadedChunks === totalChunks) {
        await mergeFileChunks(uploadId, key, etags, index);
      }
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
    let body = {
      upload_id: uploadFileDetails[0]?.upload_id,
      file_key: uploadFileDetails[0]?.file_key,
      parts: +fileFormData.totalChunksParts,
    };
    try {
      const response = await resumeUploadAPI(body);

      if (!response.success) {
        throw new Error("Failed to resume upload");
      }
      const unuploadedParts = response.data;
      await uploadFileIntoChunksforNotUploaded(
        uploadFileDetails[0]?.upload_id,
        file,
        index,
        uploadFileDetails[0]?.file_key,
        unuploadedParts
      );
    } catch (error) {
      console.error(error);
    }
  };

  const abortFileUpload = async (index: number) => {
    let body = {
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
