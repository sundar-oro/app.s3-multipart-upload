import { $fetch } from "@/lib/servicehelpers/fetch";
import { handleAPIErrorResponse } from "@/lib/servicehelpers/httpErrorHandler";

export const startUploadSinglepartFileAPI = async (body: any, id: any) => {
  try {
    const { data, success } = await $fetch.post(
      `/categories/${id}/files/generate-presigned-url`,
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


export const mergeSinglePartAPI = async (body: any, id: any) => {
  try {
    const { data, success } = await $fetch.post(
      `/categories/${id}/files`,
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




