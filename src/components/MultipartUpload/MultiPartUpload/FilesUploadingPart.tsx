"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { bytesToMB } from "@/lib/helpers/uploadHelpers";
import { uploadImagesComponentProps } from "@/lib/interfaces";
import { CheckCircle, Upload, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const UploadFiles: React.FC<uploadImagesComponentProps> = ({
  handleFileChange,
  multipleFiles,
  previewImages,
  fileProgress,
  fileErrors,
  setMultipleFiles,
  setFileFormData,
  fileFormData,
  setFileProgress,
  resumeUpload,
  abortFileUpload,
  abortedFiles,
  uploadProgressStart,
  fileTitles,
  setFileTitles,
  selectedCategoryId,
  setSelectedCategoryId,
  setShowFileUpload,
  from,
  setFileErrors,
}) => {
  const { file_id } = useParams();

  const [file, setFile] = useState<File[]>([]);
  const [startUploading, setStartUploading] = useState(false);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setMultipleFiles([]);
      setFileTitles([]);
      setFile(acceptedFiles);
      handleFileChange(acceptedFiles, false);
      setFileTitles((prev: any) => [
        ...prev,
        ...Array(acceptedFiles.length).fill(""),
      ]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      // "image/*": [],
      // "video/*": [],
      // "application/pdf": [],
      // "text/csv": [],
      // "text/plain": [],
    },
  });

  const removeFileAfterAdding = (index: number) => {
    const updatedFiles = multipleFiles.filter((_, i) => i !== index);
    const updatedTitles = fileTitles.filter((_: any, i: any) => i !== index);

    setMultipleFiles(updatedFiles);
    setFileTitles(updatedTitles);
    abortFileUpload(index);
  };

  const retryUpload = (file: File, index: number) => {
    resumeUpload(file, index);
  };

  const handleTitleChange = (index: number, title: string) => {
    const updatedTitles = [...fileTitles];
    updatedTitles[index] = title;
    setFileTitles(updatedTitles);
  };

  const allTitlesProvided = fileTitles.every(
    (title: any) => title.trim() !== ""
  );
  const allFilesUploaded =
    multipleFiles.length > 0 &&
    multipleFiles.every((_, index) => fileProgress[index] === 100);

  const handleCancelUpload = (index: number) => {
    abortFileUpload(index);
    setFileErrors((prev: any) => [
      ...prev,
      {
        file: { name: multipleFiles[index].name } as File,
        id: index,
        reason: "Upload Canceled",
      },
    ]);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Upload Files</h3>

      <div className="mb-4">
        <div
          {...getRootProps({
            className:
              "dropzone border-2 border-dashed border-gray-400 p-6 rounded-md cursor-pointer hover:border-gray-600",
          })}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-gray-600">Drop the file here ...</p>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-16 h-16 mb-2 text-gray-600" />
              <p className="text-gray-600">
                <u>Click to upload</u> or drag and drop files here
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 max-h-[250px] overflow-auto">
        {multipleFiles.map((item: File, index: number) => {
          const error = fileErrors.find((error: any) => error.id === index);

          return (
            <div
              className="flex items-center mb-2 p-2 bg-gray-100 rounded-md"
              key={index}
            >
              <img
                alt={item.name}
                className="w-12 h-12 object-cover mr-2"
                src={
                  previewImages.find((e) => e.fileIndex === item.name)
                    ?.previewUrl
                    ? previewImages.find((e) => e.fileIndex === item.name)
                        ?.previewUrl
                    : item.type.includes("application/pdf")
                    ? "/pdf-files.svg"
                    : item.type.includes("doc")
                    ? "doc-files.svg"
                    : "other-files.svg"
                }
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/No-Preview-1.jpg";
                }}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {item.name.length > 15
                    ? `${item.name.slice(0, 12)}...`
                    : item.name}{" "}
                  <span className="text-gray-500">({item.type})</span>
                </p>
                <input
                  type="text"
                  placeholder="Enter title"
                  className="border rounded p-1 mt-1 w-full"
                  value={fileTitles[index] || ""}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                />
                <Progress
                  value={fileProgress[index]}
                  className="my-1 bg-gray-300"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {fileProgress[index]?.toFixed(2)}%
                  </span>
                  {error ? (
                    <div className="text-red-500 text-xs">
                      {error.reason || "Upload Failed"}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {bytesToMB(item.size).toFixed(2)} MB
                    </span>
                  )}
                </div>
                <div className="flex justify-end mt-1">
                  {fileProgress[index] === 100 ? (
                    <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  ) : error ? (
                    error.reason !== "Upload Canceled" ? (
                      <Button
                        onClick={() => retryUpload(item, index)}
                        className="text-sm"
                      >
                        Retry
                      </Button>
                    ) : null
                  ) : (
                    ""
                  )}
                  {fileProgress[index] < 100 &&
                    fileProgress[index] > 0 &&
                    error?.reason !== "Upload Canceled" && (
                      <Button
                        onClick={() => handleCancelUpload(index)}
                        className="text-sm text-red-500 ml-2"
                      >
                        Cancel
                      </Button>
                    )}
                </div>
              </div>
              <Button
                onClick={() => removeFileAfterAdding(index)}
                className="ml-2 text-red-500"
                disabled={
                  fileProgress[index] == 100 || fileProgress[index] == 0
                    ? false
                    : true
                }
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button
          onClick={() => {
            setShowFileUpload(false);
            setStartUploading(false);
            if (from === "sidebar") {
              location.reload();
            }
          }}
        >
          Close
        </Button>
        <Button
          onClick={() => {
            uploadProgressStart(true);
            setStartUploading(true);
          }}
          disabled={
            !file.length ||
            fileErrors.length > 0 ||
            multipleFiles.length === 0 ||
            allFilesUploaded ||
            startUploading ||
            (!selectedCategoryId && from === "sidebar") ||
            !allTitlesProvided
          }
          className={`w-[50%] ${
            !file.length ||
            fileErrors.length > 0 ||
            multipleFiles.length === 0 ||
            allFilesUploaded ||
            startUploading ||
            (!selectedCategoryId && from === "sidebar") ||
            !allTitlesProvided
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Upload
        </Button>
      </div>
    </div>
  );
};

export default UploadFiles;
