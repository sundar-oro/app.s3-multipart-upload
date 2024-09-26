"use client";

import { filedetails } from "@/lib/interfaces";
import { RootState } from "@/redux";
import { useParams, useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { getSelectAllCategoriesAPI } from "@/lib/services/categories";
import { IUseFileUploadHook } from "@/lib/interfaces/files";

const useFileUploadHook = ({
  showFileUpload,
  setShowFileUpload,
  getAllFiles,
  from,
}: IUseFileUploadHook) => {
  const router = useRouter();
  const { file_id } = useParams();

  const [open, setOpen] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [parts, setParts] = useState(5);
  const [data, setData] = useState({});
  const [categoriesData, setCategoriesData] = useState([]);
  const [size, setSize] = useState({
    size: "",
    unit: 1024 * 1024,
    filename: "",
    filesize: 0,
    filetype: "",
  });
  const [filestatus, setFileStatus] = useState<filedetails[]>([]);
  const [etagData, setEtagData] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<String>("");
  const [uploaddata, setUploadData] = useState<any>({
    parts: 0,
    upload_id: "",
    file_key: "",
  });
  const [urls, setUrls] = useState([]);

  const user = useSelector((state: RootState) => state?.user?.access_token);

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
      setParts(50);
      return 50;
    }
  };

  const handleCancel = () => {
    {
      setShowFileUpload && setShowFileUpload(false);
    }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUploadData((prev: any) => ({ ...prev, [name]: value }));
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
        { name, size, type, status }, 
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
        await startMultipartUpload(file);
      } else {
        await getsinglepartpresignedurl(file);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      setSelectedFiles(files);
    },
    multiple: false,
    accept: {},
  });

  const getAllCategories = async () => {
    try {
      const response = await getSelectAllCategoriesAPI();

      if (response.status === 200 || response.status === 201) {
        setCategoriesData(response?.data?.data);
      } else {
        throw response;
      }
    } catch (error) {
      console.error("Failed to call API", error);
    } finally {
    }
  };

  // Single-part upload (file < 5 MB)
  const getsinglepartpresignedurl = async (file: any) => {
    let categoriesId;
    if (from == "sidebar") {
      categoriesId = selectedCategoryId;
    } else {
      categoriesId = file_id;
    }

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
        setUploadProgress(33);
        setUploadData(result?.data);
        await s3partfile(result?.data, file);
      } else {
        throw result;
      }
    } catch (error) {
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
        setUploadProgress(66);
        await addsinglepartfile(data, file);
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
    let categoriesId;
    if (from == "sidebar") {
      categoriesId = selectedCategoryId;
    } else {
      categoriesId = file_id;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoriesId}/files`,
        {
          method: "POST",
          body: JSON.stringify({
            title: `${uploaddata.title} 
          (${selectedFiles.findIndex((e) => e.name === file.name)})`,
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
        setUploadProgress(100);
        updateFileStatus(file.name, file.size, file.type, "success");
        setSelectedCategoryId("");
        if (file_id) {
          getAllFiles && getAllFiles(1);
        } else {
          router.push("/myfiles");
        }
        toast.success(result?.message);
        handleClear();
        setTimeout(() => {
          setUploadProgress(0);
        }, 2000);
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
  const startMultipartUpload = async (file: File) => {
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
        setUploadData(result?.data);
        setUploadProgress(5);
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
        setUploadProgress(20);
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
    setUploadProgress(43);
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
        setUploadProgress(60);
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
        setUploadProgress(100);
        // updateFileStatus(file.name, file.size, file.type, "success");
        await addMultipartfiletoDB();
        toast.success(result?.message);
        handleClear();
        setTimeout(() => {
          setUploadProgress(0);
        }, 5000);
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
            title: `${uploaddata.title}`,
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
        setUploadProgress(100);
        // updateFileStatus(file.name, file.size, file.type, "success");
        getAllFiles && getAllFiles(1);
        // toast.success(result?.message);
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

  useEffect(() => {
    getAllCategories();
  }, []);

  return {
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
  };
};
export default useFileUploadHook;
