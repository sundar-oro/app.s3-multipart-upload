"use client";
import {
  calculateChunks,
  generateVideoThumbnail,
  previewImagesEvent,
} from "@/lib/helpers/uploadHelpers";
import {
  FileError,
  FileFormData,
  FilePreview,
  FileProgress,
  PresignedUrlsResponse,
  UploadFileResponse,
} from "@/lib/interfaces";
import {
  abortUploadingAPI,
  getPresignedUrlsForFileAPI,
  getPresignedUrlsForIncompleteFileAPI,
  mergeAllChunksAPI,
  resumeUploadAPI,
  startUploadMultipartFileAPI,
} from "@/lib/services/multipart";

import { IUseFileUploadHook } from "@/lib/interfaces/files";
import { RootState } from "@/redux";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UploadFiles from "./FilesUploadingPart";
import Select from "react-select";
import { getSelectAllCategoriesAPI } from "@/lib/services/categories";

const MultiPartUploadComponent = ({
  showFileUpload,
  setShowFileUpload,
  getAllFiles,
  from,
}: IUseFileUploadHook) => {
  const { file_id } = useParams();
  const user = useSelector((state: RootState) => state?.user?.access_token);

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
  const [open, setOpen] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<any>();
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [uploadFileDetails, setUploadFileDetails] = useState<any>([]);
  const [presignedUrlsMap, setPresignedUrlsMap] = useState<{
    [index: number]: string[];
  }>({});
  const [etagsMap, setEtagsMap] = useState<{ [index: number]: string[] }>({});
  const [fileTitles, setFileTitles] = useState<string[]>(
    Array(multipleFiles.length).fill("")
  );
  const [categoriesData, setCategoriesData] = useState([]);
  const [incompleteData, setIncompleteData] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleFileTypes = (type: string) => {
    const fileType = type.toLowerCase();

    if (
      fileType === "doc" ||
      fileType === "docx" ||
      fileType === "html" ||
      fileType === "htm" ||
      fileType === "odt" ||
      fileType === "pdf" ||
      fileType === "xls" ||
      fileType === "xlsx" ||
      fileType === "csv" ||
      fileType === "ods" ||
      fileType === "ppt" ||
      fileType === "pptx" ||
      fileType === "txt"
    ) {
      return "document";
    }

    if (
      fileType === "jpeg" ||
      fileType === "jpg" ||
      fileType === "png" ||
      fileType === "svg" ||
      fileType === "gif" ||
      fileType === "psd"
    ) {
      return "image";
    }

    if (fileType === "video" || fileType === "mp4" || fileType === "mp3") {
      return "media";
    }

    return "other";
  };

  const handleFileChange = async (files: File[], start: any) => {
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
      if (file.type.startsWith("video")) {
        generateVideoThumbnail(file, previewImages, setPreviewImages);
      } else if (file.type.startsWith("image")) {
        previewImagesEvent(file, previewImages, setPreviewImages);
      }
    }
  };

  const uploadProgressStart = async (start: any) => {
    const newFiles: any = Array.from(multipleFiles);

    if (start) {
      for (const [index, file] of newFiles.entries()) {
        try {
          const { chunkSize, totalChunks } = calculateChunks(file.size);
          setFileFormData((prev) => ({
            ...prev,
            chunkSize: chunkSize.toString(),
            totalChunksParts: totalChunks.toString(),
            chunkSizeInBytes: chunkSize,
          }));
          if (file.size > 52428800) {
            await startUploadEvent(file, index, chunkSize, totalChunks);
          } else {
            await uploadSinglePartFile(file, index);
          }
        } catch (error) {
          setFileErrors((prev) => [
            ...prev,
            { file, id: index, reason: (error as Error).message },
          ]);
        }
      }
    }
  };

  const startUploadEvent = async (
    file: File,
    index: number,
    chunkSize: number,
    totalChunks: number
  ) => {
    const categoriesId = from === "sidebar" ? selectedCategoryId : file_id;

    try {
      const response: any = await startUploadMultipartFileAPI(
        {
          original_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_path: file.name,
        },
        categoriesId
      );

      if (response?.success) {
        const { upload_id, file_key } = response.data;
        setUploadFileDetails((prev: any) => [
          ...prev,
          {
            upload_id,
            file_key: response.data?.file_key,
            original_name: file.name,
            name: file.name,
            path: response.data?.file_key,
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
        { file, id: index, reason: (error as Error).message },
      ]);
    }
  };

  const fetchPresignedUrls = async (
    fileIndex: number,
    uploadId: string,
    key: string,
    totalChunks: number
  ) => {
    try {
      const categoriesId = from === "sidebar" ? selectedCategoryId : file_id;

      if (presignedUrlsMap[fileIndex]) {
        return presignedUrlsMap[fileIndex];
      }

      const response: PresignedUrlsResponse = await getPresignedUrlsForFileAPI(
        {
          file_key: key,
          upload_id: uploadId,
          parts: totalChunks,
        },
        categoriesId
      );

      if (response.data?.length === 0 || !response) {
        throw new Error("Failed to get presigned URLs");
      }
      const presignedUrls: any = response.data;
      setPresignedUrlsMap((prev) => ({ ...prev, [fileIndex]: presignedUrls }));
      return presignedUrls;
    } catch (error) {
      setFileErrors((prev) => [
        ...prev,
        {
          file: multipleFiles[fileIndex],
          id: fileIndex,
          reason: (error as Error).message,
        },
      ]);
    }
  };

  console.log(presignedUrlsMap, "urls map");

  const uploadFileIntoChunks = async (
    uploadId: string,
    file: File,
    index: number,
    key: string,
    chunkSize: number,
    totalChunks: number,
    unuploadedParts?: number[],
    initialProgress?: number
  ): Promise<void> => {
    const etags: { ETag: string; PartNumber: number }[] = [];
    const chunkProgresses: number[] = new Array(totalChunks).fill(0);
    try {
      const existingEtags: any = unuploadedParts?.length
        ? etagsMap[index] || []
        : [];

      existingEtags.forEach((part: any) => {
        chunkProgresses[part.PartNumber - 1] = 1;
      });

      if (initialProgress === 100) {
        for (let i = 0; i < totalChunks; i++) {
          chunkProgresses[i] = 1;
        }
      }

      const initialProgressPercent =
        (chunkProgresses.reduce((sum, progress) => sum + progress, 0) /
          totalChunks) *
        100;

      setFileProgress((prev) => ({
        ...prev,
        [index]: parseFloat(initialProgressPercent.toFixed(2)),
      }));
      const partsToUpload =
        unuploadedParts || Array.from({ length: totalChunks }, (_, i) => i + 1);

      const presignedUrls: string[] = await fetchPresignedUrls(
        index,
        uploadId,
        key,
        partsToUpload.length
      );
      const uploadPromises = partsToUpload.map(async (partNumber) => {
        const chunkIndex = partNumber - 1;
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const url = presignedUrls[chunkIndex];
        try {
          const { etag } = await uploadChunk(
            url,
            file,
            partNumber,
            start,
            end,
            file.size,
            (partNumber, chunkProgress) => {
              chunkProgresses[chunkIndex] = chunkProgress;
              const totalLoaded = chunkProgresses.reduce(
                (sum, progress) => sum + progress,
                0
              );
              const overallProgress = (totalLoaded / totalChunks) * 100;
              setFileProgress((prev) => ({
                ...prev,
                [index]: parseFloat(overallProgress.toFixed(2)),
              }));
            }
          );

          etags.push({ ETag: etag, PartNumber: partNumber });
        } catch (error) {
          setFileErrors((prev) => [
            ...prev,
            { file, id: index, reason: (error as Error).message },
          ]);
        }
      });

      await Promise.all(uploadPromises);

      const allEtags = [...existingEtags, ...etags];

      if (allEtags.length === totalChunks) {
        await mergeFileChunks(uploadId, key, allEtags, index, file);
        setPresignedUrlsMap((prev) => {
          const newMap = { ...prev };
          delete newMap[index];
          return newMap;
        });
        setEtagsMap((prev) => {
          const newMap = { ...prev };
          delete newMap[index];
          return newMap;
        });
      } else {
        setEtagsMap((prev) => ({ ...prev, [index]: allEtags }));
      }
    } catch (error) {
      setFileErrors((prev) => [
        ...prev,
        { file, id: index, reason: (error as Error).message },
      ]);
    }
  };
  const uploadChunk = async (
    url: string,
    file: File,
    partNumber: number,
    start: number,
    end: number,
    totalFileSize: number,
    progressCallback: (partNumber: number, chunkProgress: number) => void
  ): Promise<{ etag: string }> => {
    const chunk = file.slice(start, end);
    const response = await axios.put(url, chunk, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
      onUploadProgress: (progressEvent: any) => {
        const { loaded } = progressEvent;
        const chunkProgress = loaded / (end - start);
        progressCallback(partNumber, chunkProgress);
      },
    });
    const etag = response.headers["etag"];
    return { etag };
  };

  const mergeFileChunks = async (
    uploadId: string,
    fileKey: string,
    etags: { ETag: string; PartNumber: number }[],
    index: number,
    file: File
  ) => {
    const categoriesId = from === "sidebar" ? selectedCategoryId : file_id;

    const sortedEtags = etags
      .slice()
      .sort((a, b) => a.PartNumber - b.PartNumber);

    try {
      const response = await mergeAllChunksAPI(
        {
          file_key: fileKey,
          upload_id: uploadId,
          parts: sortedEtags,
        },
        categoriesId
      );
      if (!response.success) {
        setFileProgress((prev) => ({ ...prev, [index]: 99 }));
        throw new Error("Failed to merge chunks");
      } else {
        setFileProgress((prev) => ({ ...prev, [index]: 100 }));
        await saveFileMetadata(file, index, fileKey);
      }
    } catch (error) {
      setFileErrors((prev) => [
        ...prev,
        {
          file: { name: fileKey } as File,
          id: index,
          reason: (error as Error).message,
        },
      ]);
    }
  };

  const resumeUploadForMultipart = async (file: File, index: number) => {
    let body = {
      upload_id: uploadFileDetails[index]?.upload_id,
      file_key: uploadFileDetails[index]?.file_key,
      parts: +fileFormData.totalChunksParts,
    };
    const categoriesId = from === "sidebar" ? selectedCategoryId : file_id;

    try {
      const response = await resumeUploadAPI(body, categoriesId);

      if (!response.success) {
        throw new Error("Failed to resume upload");
      }
      const unuploadedParts = response.data || [];
      const { chunkSize, totalChunks } = calculateChunks(file.size);
      await uploadFileIntoChunks(
        uploadFileDetails[index]?.upload_id,
        file,
        index,
        uploadFileDetails[index]?.file_key,
        chunkSize,
        totalChunks,
        unuploadedParts,
        fileProgress[index]
      );
    } catch (error) {
      console.error(error);
    }
  };

  const resumeUpload = async (file: File, index: number) => {
    let erros = [...fileErrors];
    erros = erros.filter((error) => error.id !== index);
    setFileErrors(erros);
    if (file.size > 5242880) {
      await resumeUploadForMultipart(file, index);
    } else {
      await uploadSinglePartFile(file, index);
    }
  };

  const abortFileUpload = async (index: number) => {
    const categoriesId = from === "sidebar" ? selectedCategoryId : file_id;

    const body = {
      upload_id: uploadFileDetails[index]?.upload_id,
      file_key: uploadFileDetails[index]?.file_key,
    };
    try {
      const response = await abortUploadingAPI(body, categoriesId);
      if (!response.success) {
        throw new Error("Failed to abort upload");
      }
      setAbortedFiles((prev) => new Set(prev.add(index)));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIncompletePresignedUrls = async (
    index: number,
    totalChunks: number,
    chunkSize: number,
    file: File
  ) => {
    const categoriesId = from === "sidebar" ? selectedCategoryId : file_id;

    if (presignedUrlsMap[index]) {
      return presignedUrlsMap[index];
    }
    const upload_id = uploadFileDetails[0]?.upload_id;
    const file_key = uploadFileDetails[0]?.file_key;

    const response: PresignedUrlsResponse =
      await getPresignedUrlsForIncompleteFileAPI(
        {
          upload_id,
          file_key,
          parts: totalChunks,
        },
        categoriesId
      );

    if (!response.success) {
      throw new Error("Failed to get presigned URLs");
    }

    const incompleteParts: any = response.data;
    setIncompleteData(incompleteParts);
    console.log(incompleteParts, "inCOMPLETE");
    await uploadFileIntoChunks(
      upload_id,
      file,
      index,
      file_key,
      chunkSize,
      totalChunks,
      incompleteParts
    );
  };

  // Upload single part file which is less than 5 mb
  const uploadSinglePartFile = async (file: File, index: number) => {
    const categoriesId = from === "sidebar" ? selectedCategoryId : file_id;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoriesId}/files/generate-presigned-url`,
        {
          method: "POST",
          body: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
          }),
        }
      );
      const result = await response.json();

      if (response.ok) {
        const { upload_id, file_key } = result.data;
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
        await uploadFileToS3(
          result.data.generate_url,
          file,
          index,
          result?.data.path
        );
      } else {
        throw new Error(result.message || "Failed to generate presigned URL");
      }
    } catch (error) {
      setFileErrors((prev) => [
        ...prev,
        { file, id: index, reason: (error as Error).message },
      ]);
    }
  };

  const uploadFileToS3 = async (
    url: string,
    file: File,
    index: number,
    path: any
  ) => {
    try {
      await axios.put(url, file, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
        onUploadProgress: (progressEvent) => {
          const chunkProgress = (progressEvent.loaded / file.size) * 100;
          setFileProgress((prev) => ({
            ...prev,
            [index]: parseFloat(chunkProgress.toFixed(2)),
          }));
        },
      });
      await saveFileMetadata(file, index, path);
    } catch (error) {
      setFileErrors((prev) => [
        ...prev,
        { file, id: index, reason: (error as Error).message },
      ]);
    }
  };

  const saveFileMetadata = async (file: File, index: number, path: any) => {
    if (abortedFiles.has(index)) {
      return;
    }
    const categoriesId = from === "sidebar" ? selectedCategoryId : file_id;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoriesId}/files`,
        {
          method: "POST",
          body: JSON.stringify({
            title: fileTitles[index],
            name: file.name,
            size: file.size,
            path: path,
            mime_type: file.type,
            type: handleFileTypes(file.type.split("/")[1]),
            tags: ["image", "sample"],
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: user,
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        if (file_id) {
          getAllFiles && getAllFiles(1);
        }
      } else {
        setFileProgress((prev) => ({ ...prev, [index]: 99 }));
        throw new Error(result.errors?.title[0] || result.message);
      }
    } catch (error) {
      setFileErrors((prev) => [
        ...prev,
        {
          file: { name: file.name } as File,
          id: index,
          reason: (error as Error).message,
        },
      ]);
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await getSelectAllCategoriesAPI();

      if (response.status === 200 || response.status === 201) {
        const options = response?.data.data?.map((category: any) => ({
          value: category.id,
          label: category.name,
        }));
        setCategoriesData(options);
      } else {
        throw response;
      }
    } catch (error) {
      console.error("Failed to call API", error);
    } finally {
    }
  };
  const handleChange = (selectedOption: any) => {
    setSelectedCategoryId(selectedOption.value);
    setSelectedCategory(selectedOption);
  };

  useEffect(() => {
    if (showFileUpload) {
      getAllCategories();
    }
  }, [showFileUpload]);

  return (
    <div>
      {from == "sidebar" && (
        <div className="mt-10">
          <Select
            options={categoriesData}
            placeholder="Select Category"
            onChange={handleChange}
            value={selectedCategory}
          />
        </div>
      )}
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
        uploadProgressStart={uploadProgressStart}
        fileTitles={fileTitles}
        setFileTitles={setFileTitles}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        setShowFileUpload={setShowFileUpload}
        from={from}
        setFileErrors={setFileErrors}
      />
    </div>
  );
};

export default MultiPartUploadComponent;
