"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IUseFileUploadHook } from "@/lib/interfaces/files";
import { RotateCw } from "lucide-react";
import useFileUploadHook from "./useFileUploadHook";

const FileUpload = ({
  showFileUpload,
  setShowFileUpload,
  getAllFiles,
  from,
}: IUseFileUploadHook) => {
  const {
    getRootProps,
    getInputProps,
    selectedFiles,
    uploadProgress,
    uploaddata,
    handleChange,
    setSelectedCategoryId,
    categoriesData,
    filestatus,
    handleReUpload,
    open,
    handleCancel,
    handleUpload,
  } = useFileUploadHook({
    showFileUpload,
    setShowFileUpload,
    getAllFiles,
    from,
  });
  return (
    <Card className="sticky p-6 m-4 bg-white rounded-lg shadow-md w-full">
      <div className="flex flex-col h-full justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <p>Drag and drop a file here, or click to select a file</p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Selected Files:</h3>
              <table className="table-auto w-full border-collapse mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">File Name</th>
                    <th className="border px-4 py-2">File Size</th>
                    <th className="border px-4 py-2">File Type</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedFiles.map((file, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-pointer">
                                {file?.name.length > 18
                                  ? `${file?.name.slice(0, 18)}...`
                                  : `${file?.name}`}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{file?.name}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="border px-4 py-2">
                        {Math.ceil(file.size / 1024)} KB
                      </td>
                      <td className="border px-4 py-2">{file.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {uploadProgress > 0 && (
            <div className="mt-4">
              <Progress value={uploadProgress} />
              <p className="text-center mt-2">{uploadProgress}%</p>
            </div>
          )}

          {uploadProgress === 100 && (
            <div
              className="flex items-center ml-10"
              style={{ marginLeft: "130px" }}
            >
              <img
                src="/files/success.svg"
                alt="successful"
                width={60}
                height={60}
                className="rounded-lg"
              />
            </div>
          )}

          <div className="mt-4">
            <Label htmlFor="size">Title</Label>
            <Input
              name="title"
              value={uploaddata?.title}
              disabled={selectedFiles?.length ? false : true}
              placeholder="Enter File Name"
              onChange={handleChange}
              className="mt-2"
            />
          </div>

          {from == "sidebar" && (
            <div className="mt-10">
              <Select
                disabled={selectedFiles?.length ? false : true}
                onValueChange={(value) => setSelectedCategoryId(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesData?.map((category: any) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div>
          <ul>
            {filestatus.map((file, index) => (
              <>
                <h3>Uploaded Files:</h3>
                <li key={index} className="flex items-center space-x-4">
                  <span>{file.name}</span>
                  <span>
                    {file.status === "success" ? (
                      <span className="text-green-500">Success</span>
                    ) : file.status === "uploading" ? (
                      <span className="text-yellow-500">Uploading</span>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-red-500">Failed</span>
                        <RotateCw onClick={() => handleReUpload(file)} />
                      </div>
                    )}
                  </span>
                </li>
              </>
            ))}
          </ul>
        </div>

        {open && (
          <div className="flex justify-end mt-4">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              className="ml-2"
              disabled={
                selectedFiles?.length && uploaddata?.title ? false : true
              }
            >
              Upload
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FileUpload;
