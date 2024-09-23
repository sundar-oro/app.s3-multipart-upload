import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { bytesToMB } from "@/lib/helpers/uploadHelpers";
import { uploadImagesComponentProps } from "@/lib/interfaces";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, CheckCircle } from "lucide-react"; // Importing lucide-react icons

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
}) => {
  const [file, setFile] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles);
      handleFileChange(acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
      "application/pdf": [],
      "text/csv": [],
      "text/plain": [],
    },
  });

  const removeFileAfterAdding = (index: number) => {
    const updatedFiles = multipleFiles.filter((_, i) => i !== index);
    const updatedProgress = { ...fileProgress };
    delete updatedProgress[index];
    setMultipleFiles(updatedFiles);
    setFileProgress(updatedProgress);
  };

  const retryUpload = (file: File, index: number) => {
    resumeUpload(file, index);
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
      {/* <button onClick={() => handleFileChange(file)}>Upload</button> */}
      <div className="mt-4">
        {multipleFiles.map((item: File, index: number) => (
          <div
            className="flex items-center mb-2 p-2 bg-gray-100 rounded-md"
            key={index}
          >
            <img
              alt={item.name}
              className="w-12 h-12 object-cover mr-2"
              src={
                previewImages.find((e) => e.fileIndex === item.name)?.previewUrl
                  ? previewImages.find((e) => e.fileIndex === item.name)
                      ?.previewUrl
                  : item.type.includes("application/pdf")
                  ? "/pdf-icon1.png"
                  : "/doc-icon.png"
              }
            />
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {item.name.length > 15
                  ? `${item.name.slice(0, 12)}...`
                  : item.name}{" "}
                <span className="text-gray-500">({item.type})</span>
              </p>
              <Progress
                value={fileProgress[index]}
                className="my-1 bg-gray-300"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {fileProgress[index]?.toFixed(2)}%
                </span>
                {fileErrors[index] ? (
                  <div className="text-red-500 text-xs">
                    {fileErrors[index].reason || "Upload Failed"}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">
                    {bytesToMB(item.size).toFixed(2)} MB
                  </span>
                )}
              </div>
              <div className="flex justify-end mt-1">
                {abortedFiles.has(index) ? (
                  <p className="text-red-500 text-xs">Canceled</p>
                ) : fileProgress[index] === 100 ? (
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                ) : (
                  <Button
                    onClick={() =>
                      fileErrors[index]
                        ? retryUpload(item, index)
                        : abortFileUpload(index)
                    }
                    className="text-sm"
                  >
                    {fileErrors[index] ? "Retry" : "Cancel"}
                  </Button>
                )}
              </div>
            </div>
            <Button
              onClick={() => removeFileAfterAdding(index)}
              className="ml-2 text-red-500"
              disabled={fileProgress[index] !== 100}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadFiles;
