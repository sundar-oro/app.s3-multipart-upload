"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { filedetails } from "@/lib/interfaces";

const FileUpload = ({
  showFileUpload,
  setShowFileUpload,
  getAllFiles,
}: {
  showFileUpload: boolean;
  setShowFileUpload: Dispatch<SetStateAction<boolean>>;
  getAllFiles: (page: number) => void;
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [data, setData] = useState({});
  const [size, setSize] = useState({
    size: "",
    unit: 1024 * 1024,
    filename: "",
    filesize: 0,
    filetype: "",
  });
  const [filestatus, setFileStatus] = useState<filedetails[]>([]);

  const [uploaddata, setUploadData] = useState({
    parts: 0,
  });
  const [urls, setUrls] = useState([]);

  const { file_id } = useParams();

  console.log(chunks);

  const handleToggle = () => {
    setShowFileUpload((prevState: any) => !prevState);
  };

  const handleCancel = () => {
    setShowFileUpload(false);
    setSize({
      size: "",
      unit: 1024 * 1024,
      filename: "",
      filesize: 0,
      filetype: "",
    });
    setChunks([]);
    setSelectedFiles([]);
  };

  const handleClear = () => {
    setSize({
      size: "",
      unit: 1024 * 1024,
      filename: "",
      filesize: 0,
      filetype: "",
    });
    setChunks([]);
    setSelectedFiles([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUploadData((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const updateFileStatus = (filename: string, status: string) => {
    setFileStatus((prev) =>
      prev.map((file) =>
        file.filename === filename ? { ...file, status } : file
      )
    );
  };

  const handleUpload = async () => {
    if (size.filesize > 5242880) {
      await postapi();
    } else {
      await getsinglepartpresignedurl();
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      const file = files[0];
      if (file) {
        setSelectedFiles([file]);
        setSize({
          ...size,
          filename: file.name,
          filesize: file.size,
          filetype: file.type,
        });
      }
    },
    multiple: false,
    accept: {},
  });

  // Single-part upload (file < 5 MB)
  const getsinglepartpresignedurl = async () => {
    setOpen(false);
    setUploadProgress(1);
    setFileStatus((prev) => [
      ...prev,
      { filename: size.filename, status: "uploading" },
    ]);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${file_id}/files/generate-presigned-url`,
        {
          method: "POST",
          body: JSON.stringify({
            file_name: size.filename,
            file_size: size.filesize,
            file_type: size.filetype,
          }),
        }
      );
      const result = await response.json();

      if (result.status === 200 || result.status === 201) {
        console.log(result);
        setUploadProgress(33);
        setUploadData(result?.data);
        s3partfile(result?.data);
      } else {
        throw result;
      }
    } catch (error) {
      console.error("Failed to call API", error);
      updateFileStatus(size.filename, "failed");
      handleClear();
    }
  };

  const s3partfile = async (data: any) => {
    console.log(data, "s3");
    try {
      const response = await fetch(data?.generateUrl, {
        method: "PUT",
        body: selectedFiles[0],
      });

      if (response.ok) {
        console.log("Single-part file upload successful");
        setUploadProgress(66);
        addsinglepartfile(data);
      } else {
        throw response;
      }
    } catch (error) {
      console.error("Failed to upload single part file", error);
      updateFileStatus(size.filename, "failed");
      handleClear();
    }
  };

  const addsinglepartfile = async (data: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${file_id}/files`,
        {
          method: "POST",
          body: JSON.stringify({
            name: data.file_name,
            size: data.file_size,
            path: data?.path,
            mime_type: data?.file_type,
            type: data?.file_type?.split("/")[0],
            tags: ["image", "sample"],
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        console.log("File metadata saved:", result);
        setUploadProgress(100);
        updateFileStatus(size.filename, "success");
        getAllFiles(1);
        toast.success(result?.message);
        handleClear();
      } else {
        throw result;
      }
    } catch (error) {
      console.error("Failed to save file metadata", error);
      toast.error("Failed to Upload the file");
      updateFileStatus(size.filename, "failed");
      handleClear();
    } finally {
      setOpen(true);
    }
  };

  // Multi-part upload (file > 5 MB)
  const postapi = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${file_id}/files/start`,
        {
          method: "POST",
          body: JSON.stringify({
            original_name: size.filename,
            file_type: size.filetype,
            file_size: size.filesize,
          }),
        }
      );
      const result = await response.json();

      if (response.ok) {
        console.log(result);
        setUploadData(result?.data);
        getpresignedurl(result?.data);
      }
    } catch (error) {
      console.error("Failed to start multi-part upload", error);
    }
  };

  const getpresignedurl = async (data: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${file_id}/files/urls`,
        {
          method: "POST",
          body: JSON.stringify(data), //should add parts
        }
      );

      const result = await response.json();

      if (response.ok) {
        setUrls(result?.data);
        uploadDocuments(result?.data);
      }
    } catch (error) {
      console.error("Failed to fetch presigned URLs", error);
    }
  };

  const uploadDocuments = async (chunkurls: []) => {
    const chunkSize = size.filesize / uploaddata.parts;
    const chunkArray: Blob[] = [];

    for (const file of selectedFiles) {
      let start = 0;
      while (start < file.size) {
        const chunk = file.slice(start, start + chunkSize);
        chunkArray.push(chunk);
        start += chunkSize;
      }
    }

    setChunks(chunkArray);
    setData((prev) => ({ ...prev, parts: chunkArray.length }));

    for (let i = 0; i < chunkArray.length; i++) {
      await uploadChunk(chunkArray[i], i, chunkurls[i], chunkArray.length);
    }
  };

  const uploadChunk = async (
    chunk: Blob,
    index: number,
    url: string,
    totalChunks: number
  ) => {
    try {
      await fetch(url, {
        method: "PUT",
        body: chunk,
      });

      setUploadProgress(Math.round(((index + 1) / totalChunks) * 100));
    } catch (error) {
      console.error(`Upload failed for URL ${url}, chunk ${index}`, error);
    }
  };

  return (
    <Card className="sticky h-screen p-6 m-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col h-full justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <p>Drag 'n' drop a file here, or click to select a file</p>
          </div>
          {size.filename && (
            <div className="mt-4">
              <p>File name: {size.filename}</p>
              <p>File size: {size.filesize} bytes</p>
              <p>File Type: {size.filetype}</p>
            </div>
          )}

          {/* Show Chunk Size only if file is > 5MB */}
          {size.filesize > 5242880 && (
            <div className="mt-4">
              <Label htmlFor="parts">Chunk Size</Label>
              <Input
                name="parts"
                value={uploaddata && uploaddata?.parts}
                placeholder="Enter chunk size"
                onChange={(e) =>
                  setUploadData({
                    ...uploaddata,
                    parts: parseInt(e.target.value),
                  })
                }
                type="number"
                className="mt-2"
              />
            </div>
          )}

          {uploadProgress > 0 && (
            <div className="mt-4">
              <Progress value={uploadProgress} />
              <p className="text-center mt-2">{uploadProgress}%</p>
            </div>
          )}

          {uploadProgress === 100 && (
            <div className="flex items-center" style={{ marginLeft: "80px" }}>
              <img
                src="/files/success.svg"
                alt="successful"
                width={60}
                height={60}
                className="rounded-lg"
              />
            </div>
          )}
          {/* <div className="mt-4">
              <Label htmlFor="size">Chunk Size</Label>
              <Input
                name="size"
                value={size.size}
                placeholder="Enter chunk size"
                onChange={handleChange}
                type="number"
                className="mt-2"
              />

              <Label htmlFor="unit" className="mt-4">
                Units
              </Label>
              <Select
                onValueChange={(value: any) =>
                  setSize((prev) => ({ ...prev, unit: Number(value) }))
                }
                value={String(size.unit)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1048576">MB</SelectItem>
                  <SelectItem value="1073741824">GB</SelectItem>
                  <SelectItem value="1099511627776">TB</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
        </div>
        <div>
          <h3>Uploaded Files:</h3>
          <ul>
            {filestatus.map((file, index) => (
              <li key={index} className="flex items-center space-x-4">
                <span>{file.filename}</span>
                <span>
                  {file.status === "success" ? (
                    <span className="text-green-500">Success</span>
                  ) : file.status === "uploading" ? (
                    <span className="text-yellow-500">Uploading</span>
                  ) : (
                    <span className="text-red-500">Failed</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {open && (
          <div className="flex justify-end mt-4">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleUpload} className="ml-2">
              Upload
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FileUpload;
