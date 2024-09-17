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
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

const FileUpload = ({
  showFileUpload,
  setShowFileUpload,
}: {
  showFileUpload: boolean;
  setShowFileUpload: Dispatch<SetStateAction<boolean>>;
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

  console.log(chunks);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSize((prev) => ({ ...prev, [name]: value }));
  };

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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      const file = files[0];
      if (file) {
        setSelectedFiles(files);
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

  const postapi = async () => {
    try {
      const response = await fetch("/upload-endpoint", {
        method: "POST",
        body: JSON.stringify({
          original_name: size.filename,
          file_type: size.filesize,
          file_size: size.filetype,
        }),
      });

      if (response.status === 200 || response.status === 201) {
        setData(response);
      }
    } catch (error) {
      console.error("Failed to call api", error);
    }
  };

  const uploadDocuments = async () => {
    const chunkSize = parseInt(size.size) * size.unit;

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
      await uploadChunk(chunkArray[i], i, chunkArray.length);
    }
  };

  const uploadChunk = async (
    chunk: Blob,
    index: number,
    totalChunks: number,
    retries = 3
  ) => {
    try {
      await fetch("/upload-endpoint", {
        method: "POST",
        body: chunk,
      });
      setUploadProgress(Math.round(((index + 1) / totalChunks) * 100));
    } catch (error) {
      if (retries > 0) {
        await uploadChunk(chunk, index, totalChunks, retries - 1);
      } else {
        console.error("Failed to upload chunk:", error);
      }
    }
  };

  useEffect(() => {
    if (selectedFiles.length > 0) {
      postapi();
    }
  }, [selectedFiles]);

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
          {chunks.length > 0 && (
            <div className="mt-4">
              <Progress value={uploadProgress} />
              <p className="text-center mt-2">{uploadProgress}%</p>
            </div>
          )}
          <div className="mt-4">
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
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={uploadDocuments} className="ml-2">
            Upload
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FileUpload;
