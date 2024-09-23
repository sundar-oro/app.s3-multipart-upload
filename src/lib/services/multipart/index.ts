import { $fetch } from "@/lib/servicehelpers/fetch";
import { handleAPIErrorResponse } from "@/lib/servicehelpers/httpErrorHandler";

export const startUploadMultipartFileAPI = async (body: any) => {
  try {
    const { data, success } = await $fetch.post(
      `/categories/5/files/start`,
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
    const { data, success } = await $fetch.post(
      `/categories/5/files/urls`,
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

export const mergeAllChunksAPI = async (body: any) => {
  try {
    const { data, success } = await $fetch.post(
      `/categories/5/files/complete`,
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

export const resumeUploadAPI = async (body: any) => {
  try {
    const { data, success } = await $fetch.post(
      `/multipart-upload/list-incomplete-parts`,
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

export const abortUploadingAPI = async (body: any) => {
  try {
    const { data, success } = await $fetch.post(
      `/multipart-upload/abort`,
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
