import { $fetch } from "@/lib/servicehelpers/fetch";
import { RootState } from "@/redux";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export const getAllFilesAPI = async (
  params: any,
  file_id: string | string[]
) => {
  try {
    return await $fetch.get(`/categories/${file_id}/files`, params);
  } catch (err) {
    throw err;
  }
};

export const getMyFilesAPI = async (params: any) => {
  try {
    return await $fetch.get("/files", params);
  } catch (err) {
    throw err;
  }
};

export const getSingleFileAPI = async (categoryid: number,fileid: number) => {
  try {
    return await $fetch.get(`/categories/${categoryid}/files/${fileid}`);
  } catch (err) {
    throw err;
  }
};

export const updateCategoryAPI = async (
  id: number,
  payload: any
) => {
  try {
    return await $fetch.put(`/categories/${id}`, payload);
  } catch (err) {
    throw err;
  }
};

export const deleteFilesAPI = async (categoryid: number, fileid: number) => {
  try {
    return await $fetch.delete(`/categories/${categoryid}/files/${fileid}`);
  } catch (err) {
    throw err;
  }
};

export const deleteMyFilesAPI = async (fileid: number) => {
  try {
    return await $fetch.delete(`/files/${fileid}`);
  } catch (err) {
    throw err;
  }
};

export const handleDownloadFile = async (url: string, title: string) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = title;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download error:", error);
    toast.error("File download failed");
  }
};

