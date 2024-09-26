import { $fetch } from "@/lib/servicehelpers/fetch";
import { handleAPIErrorResponse } from "@/lib/servicehelpers/httpErrorHandler";

export const startUploadMultipartFileAPI = async (body: any, id: any) => {
  try {
    const { data, success } = await $fetch.post(
      `/categories/${id}/files/start`,
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

export const getPresignedUrlsForFileAPI = async (body: any, id: any) => {
  try {
    const { data, success } = await $fetch.post(
      `/categories/${id}/files/urls`,
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

export const getPresignedUrlsForIncompleteFileAPI = async (body: any, id: any) => {
  try {
    const { data, success } = await $fetch.post(
      `/categories/${id}/files/list-incomplete-parts`,
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

export const mergeAllChunksAPI = async (body: any, id: any) => {
  try {
    const { data, success } = await $fetch.post(
      `/categories/${id}/files/complete`,
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

export const resumeUploadAPI = async (body: any, id: any) => {
  try {
    const { data, success } = await $fetch.post(
      `/categories/${id}/files/list-incomplete-parts`,
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

export const abortUploadingAPI = async (body: any, id: any) => {
  try {
    const { data, success } = await $fetch.post(
      `/categories/${id}/files/abort`,
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
