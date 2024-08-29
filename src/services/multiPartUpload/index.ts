import { $fetch } from "../fetch";
import { handleAPIErrorResponse } from "../httpErrorHandler";

export const startUploadMultipartFileAPI = async (body: any) => {
  try {
    const { data, success } = await $fetch.post(
      `/multipart-upload/start`,
      body
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error();
  }
};

export const getPresignedUrlsForFileAPI = async (body: any) => {
  try {
    const { data, success } = await $fetch.post(`/multipart-upload/urls`, body);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error();
  }
};

export const mergeAllChunksAPI = async (body: any) => {
  try {
    const { data, success } = await $fetch.post(
      `/multipart-upload/complete`,
      body
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    console.error();
  }
};
