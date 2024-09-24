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

export const deleteFilesAPI = async (categoryid: number,fileid: number) => {
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
    toast.error("File download failed");
  }
};

//   export const getAllFilesAPI = async (page :number ,file_id: string | string[]) => {
//   try {
//     return await $fetch.get(`/categories/${file_id}/files?page=${page}&limit=10`);
//   } catch (err) {
//     throw err;
//   }
// };

// export const getFilesAPI = async () => {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `${process.env.NEXT_PUBLIC_API_TOKEN}`,
//       },
//     });

//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     return await res.json();
//   } catch (err) {
//     console.error("Error creating category:", err);
//     throw err;
//   }
// };

// export const getAllFilesAPI = async (page :number ,file_id: string | string[]) => {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${file_id}/files?page=${page}&limit=10`, {
//       method: "GET",
