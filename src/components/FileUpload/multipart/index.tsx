"use client";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

const MultiPartUpload = () => {
  const router = useRouter();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [data, setData] = useState({});
  const [uploaddata, setUploadData] = useState({
    parts: 0,
  });
  const [urls, setUrls] = useState([]);
  const [size, setSize] = useState({
    size: "",
    unit: 1024 * 1024,
    filename: "",
    filesize: 0,
    filetype: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUploadData((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleCancel = () => {
    setSize({
      size: "",
      unit: 1024 * 1024,
      filename: "",
      filesize: 0,
      filetype: "",
    });
    setChunks([]);
    setSelectedFiles([]);
    router.back();
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
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/5/files/generate-presigned-url`,
        {
          method: "POST",
          body: JSON.stringify({
            file_name: size.filename,
            file_size: size.filesize,
          }),
        }
      );
      const result = await response.json();

      if (response.ok) {
        console.log(result);
        setUploadProgress(33);
        setUploadData(result);
        s3partfile(result);
      }
    } catch (error) {
      console.error("Failed to call API", error);
    }
  };

  const s3partfile = async (data: any) => {
    try {
      const response = await fetch(data?.url, {
        method: "PUT",
        body: selectedFiles[0],
      });

      if (response.ok) {
        console.log("Single-part file upload successful");
        setUploadProgress(66); // Full progress for single-part upload
        addsinglepartfile(data);
      }
    } catch (error) {
      console.error("Failed to upload single part file", error);
    }
  };

  const addsinglepartfile = async (data: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/5/files`,
        {
          method: "POST",
          body: JSON.stringify({
            name: data.file_name,
            size: data.file_size,
            path: data?.path,
            mime_type: size?.filetype,
            type: "image",
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
      }
    } catch (error) {
      console.error("Failed to save file metadata", error);
    }
  };

  // Multi-part upload (file > 5 MB)
  const postapi = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/5/files/start`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/categories/5/files/urls`,
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

  // useEffect(() => {
  //   if (size.filesize > 5242880) {
  //     postapi();
  //   } else {
  //     getsinglepartpresignedurl();
  //   }
  // }, [selectedFiles]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Upload Documents</h3>

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
            <p>File type: {size.filetype}</p>
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

        <div className="flex justify-end mt-4">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleUpload} className="ml-2">
            Upload
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MultiPartUpload;
