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
  getPresignedUrlsForFileAPI,
  mergeAllChunksAPI,
  startUploadMultipartFileAPI,
} from "../../services/multiPartUpload";
import UploadFiles from "./FilesUploadingPart";

const MultiPartUploadComponent: React.FC = () => {
  const filesFromStore = useSelector((state: any) => state.files?.filesList);
  const dispatch = useDispatch();

  const [multipleFiles, setMultipleFiles] = useState<File[]>(
    filesFromStore || []
  );
  const [fileProgress, setFileProgress] = useState<FileProgress>({});
  const [previewImages, setPreviewImages] = useState<FilePreview[]>([]);
  const [fileErrors, setFileErrors] = useState<FileError[]>([]);
  const [fileFormData, setFileFormData] = useState<FileFormData>({
    chunkSize: "",
    unit: "MB",
    totalChunksParts: "",
    chunkSizeInBytes: 0,
  });

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
          await generateVideoThumbnail(file, previewImages, setPreviewImages);
        } else if (file.type.startsWith("image")) {
          await previewImagesEvent(file, previewImages, setPreviewImages);
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

      if (response.success) {
        const { upload_id, file_key } = response.data;
        await uploadFileIntoChunks(upload_id, file, index, file_key);

        setFileProgress((prev) => ({ ...prev, [index]: 99 }));
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

      const uploadPromises = Array.from(
        { length: totalChunks },
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
        await mergeFileChunks(uploadId, key, etags);
        setFileProgress((prev) => ({ ...prev, [index]: 100 }));
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
    etags: { ETag: string; PartNumber: number }[]
  ) => {
    try {
      const response = await mergeAllChunksAPI({
        file_key: fileKey,
        upload_id: uploadId,
        parts: etags,
      });

      if (!response.success) {
        throw new Error("Failed to merge chunks");
      }
    } catch (error) {
      setFileErrors((prev) => [
        ...prev,
        { file: { name: fileKey } as File, reason: (error as Error).message },
      ]);
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
      />
    </div>
  );
};

export default MultiPartUploadComponent;
