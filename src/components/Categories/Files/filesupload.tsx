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
import { RotateCw, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { filedetails } from "@/lib/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";

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
  const { file_id } = useParams();

  const [open, setOpen] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [parts, setParts] = useState(5);
  const [data, setData] = useState({});
  const [size, setSize] = useState({
    size: "",
    unit: 1024 * 1024,
    filename: "",
    filesize: 0,
    filetype: "",
  });
  const [filestatus, setFileStatus] = useState<filedetails[]>([]);
  const [etagData, setEtagData] = useState<any[]>([]);
  const [uploaddata, setUploadData] = useState<any>({
    parts: 0,
    upload_id: "",
    file_key: "",
  });
  const [urls, setUrls] = useState([]);

  console.log(chunks);

  const user = useSelector((state: RootState) => state?.user?.access_token);
  // const access_token = user?.access_token;

  const handleToggle = () => {
    setShowFileUpload((prevState: any) => !prevState);
  };

  const handleParts = (size: number) => {
    const MB = 1024 * 1024; // 1 MB in bytes
    const GB = 1024 * MB; // 1 GB in bytes

    if (size < 500 * MB) {
      setParts(5);
      return 5;
    } else if (size >= 500 * MB && size < 1 * GB) {
      setParts(10);
      return 10;
    } else if (size >= 1 * GB && size < 3 * GB) {
      setParts(20);
      return 20;
    } else if (size >= 3 * GB && size < 10 * GB) {
      setParts(30);
      return 30;
    } else {
      // For any file larger than 10GB
      setParts(50);
      return 50;
    }
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

  const handleFileTypes = (type: string) => {
    if (type === "video" || type === "mp4" || type === "mp3") {
      return "media";
    } else if (
      type === "pdf" ||
      type === "csv" ||
      type === "docx" ||
      type === "xlsx"
    ) {
      return "document";
    } else {
      return "other";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUploadData((prev: any) => ({ ...prev, [name]: parseInt(value) }));
  };

  const updateFileStatus = (
    name: string,
    size: string | number,
    type: string,
    status: string
  ) => {
    setFileStatus((prev) => {
      const filtered = prev.filter((file) => file.name !== name);

      return [
        ...filtered,
        { name, size, type, status }, // Add or update the file entry
      ];
    });
  };

  const handleUpload = async () => {
    for (const file of selectedFiles) {
      setSize({
        size: "",
        unit: 1024 * 1024,
        filename: file.name,
        filesize: file.size,
        filetype: file.type,
      });

      if (file.size > 5242880) {
        await postapi(file);
      } else {
        await getsinglepartpresignedurl(file);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      setSelectedFiles(files);
    },
    multiple: true,
    accept: {},
  });

  // Single-part upload (file < 5 MB)
  const getsinglepartpresignedurl = async (file: any) => {
    setOpen(false);
    setUploadProgress(1);
    setFileStatus((prev) => [
      ...prev,
      {
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
      },
    ]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${file_id}/files/generate-presigned-url`,
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
        console.log(result);
        setUploadProgress(33);
        setUploadData(result?.data);
        await s3partfile(result?.data, file); // Upload the file to S3
      } else {
        throw result;
      }
    } catch (error) {
      console.error("Failed to call API", error);
      updateFileStatus(file.name, file.size, file.type, "failed");
      handleClear();
      setTimeout(() => {
        setUploadProgress(0);
      }, 10000);
    }
  };

  const s3partfile = async (data: any, file: any) => {
    try {
      const response = await fetch(data?.generate_url, {
        method: "PUT",
        body: file,
      });

      if (response.ok) {
        console.log("Single-part file upload successful");
        setUploadProgress(66);
        await addsinglepartfile(data, file); // Save metadata after upload
      } else {
        throw response;
      }
    } catch (error) {
      console.error("Failed to upload single part file", error);
      updateFileStatus(file.name, file.size, file.type, "failed");
      handleClear();
      setTimeout(() => {
        setUploadProgress(0);
      }, 10000);
    }
  };

  const addsinglepartfile = async (data: any, file: File) => {
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
            type: handleFileTypes(data?.file_type?.split("/")[1]),
            tags: ["image", "sample"],
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${user}`,
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        console.log("File metadata saved:", result);
        setUploadProgress(100);
        updateFileStatus(file.name, file.size, file.type, "success");
        getAllFiles(1);
        toast.success(result?.message);
        handleClear();
        setTimeout(() => {
          setUploadProgress(0);
        }, 50000);
      } else {
        throw result;
      }
    } catch (error) {
      console.error("Failed to save file metadata", error);
      toast.error("Failed to Upload the file");
      updateFileStatus(file.name, file.size, file.type, "failed");
      handleClear();
      setTimeout(() => {
        setUploadProgress(0);
      }, 10000);
    } finally {
      setOpen(true);
    }
  };

  const handleReUpload = (file: any) => {
    getsinglepartpresignedurl(file);
  };

  // Multi-part upload (file > 5 MB)
  const postapi = async (file: File) => {
    // handleParts(file.size);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${file_id}/files/start`,
        {
          method: "POST",
          body: JSON.stringify({
            original_name: file.name,
            file_type: file.type,
            file_size: file.size,
          }),
        }
      );
      const result = await response.json();

      if (response.ok) {
        console.log(result);
        setUploadData(result?.data);
        await getpresignedurl(result?.data, file);
      }
    } catch (error) {
      console.error("Failed to start multi-part upload", error);
    }
  };

  const getpresignedurl = async (data: any, file: File) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${file_id}/files/urls`,
        {
          method: "POST",
          body: JSON.stringify({
            ...data,
            parts: handleParts(file.size),
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setUrls(result?.data);
        await uploadDocuments(result?.data, file);
      }
    } catch (error) {
      console.error("Failed to fetch presigned URLs", error);
    }
  };

  const uploadDocuments = async (chunkurls: [], file: File) => {
    const chunkSize = file.size / parts;
    const chunkArray: Blob[] = [];

    let start = 0;
    while (start < file.size) {
      const chunk = file.slice(start, start + chunkSize);
      chunkArray.push(chunk);
      start += chunkSize;
    }

    setChunks(chunkArray);
    setData((prev) => ({ ...prev, parts: chunkArray.length }));

    for (let i = 0; i < chunkArray.length; i++) {
      await uploadChunk(chunkArray[i], chunkurls[i], i + 1);
    }
  };

  const uploadChunk = async (chunk: any, url: any, index: number) => {
    try {
      const response = await fetch(url, {
        method: "PUT",
        body: chunk,
      });

      if (response.ok) {
        setEtagData((prev) => [
          ...prev,
          {
            ETag: response.headers.get("etag"),
            PartNumber: index,
          },
        ]);
        console.log("Single-part file upload successful");
        setUploadProgress(66);
      } else {
        throw response;
      }
    } catch (error) {
      console.error("Failed to upload single part file", error);
      // updateFileStatus(file.name, file.size, file.type, "failed");
      handleClear();
      setTimeout(() => {
        setUploadProgress(0);
      }, 10000);
    }
  };
  console.log(uploaddata);
  const addMultipartfile = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${file_id}/files/complete`,
        {
          method: "POST",
          body: JSON.stringify({
            parts: etagData,
            file_key: uploaddata?.file_key,
            upload_id: uploaddata.upload_id,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${user}`,
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        console.log("File metadata saved:", result);
        setUploadProgress(100);
        // updateFileStatus(file.name, file.size, file.type, "success");
        await addMultipartfiletoDB();
        toast.success(result?.message);
        handleClear();
        setTimeout(() => {
          setUploadProgress(0);
        }, 50000);
      } else {
        throw result;
      }
    } catch (error) {
      console.error("Failed to save file metadata", error);
      toast.error("Failed to Upload the file");
      // updateFileStatus(file.name, file.size, file.type, "failed");
      handleClear();
      setTimeout(() => {
        setUploadProgress(0);
      }, 10000);
    } finally {
      setOpen(true);
    }
  };

  const addMultipartfiletoDB = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${file_id}/files`,
        {
          method: "POST",
          body: JSON.stringify({
            name: uploaddata.original_name,
            size: size.filesize,
            path: uploaddata?.file_key,
            mime_type: uploaddata?.file_type,
            type: handleFileTypes(uploaddata?.file_type),
            tags: ["image", "sample"],
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${user}`,
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        console.log("File metadata saved:", result);
        setUploadProgress(100);
        // updateFileStatus(file.name, file.size, file.type, "success");
        getAllFiles(1);
        toast.success(result?.message);
        handleClear();
        setTimeout(() => {
          setUploadProgress(0);
        }, 50000);
      } else {
        throw result;
      }
    } catch (error) {
      console.error("Failed to save file metadata", error);
      toast.error("Failed to Upload the file");
      // updateFileStatus(file.name, file.size, file.type, "failed");
      handleClear();
      setTimeout(() => {
        setUploadProgress(0);
      }, 10000);
    } finally {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (etagData.length === parts) {
      const handleMultipartFile = async () => {
        await addMultipartfile();
      };

      handleMultipartFile();
    }
  }, [etagData, parts]);

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
            <p>Drag drop a file here, or click to select a file</p>
          </div>
          {/* {size.filename && (
            <div className="mt-4">
              <p>File name: {size.filename}</p>
              <p>File size: {size.filesize} bytes</p>
              <p>File Type: {size.filetype}</p>
            </div>
          )} */}

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Selected Files:</h3>
              <ul className="mt-2">
                {selectedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    <span>File name:{file.name}</span>
                    <span>File size: {Math.ceil(file.size / 1024)} KB</span>
                    <span>File Type: {file.type}</span>
                  </li>
                ))}
              </ul>
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
            <div className="flex items-center" style={{ marginLeft: "130px" }}>
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
