import { prepareURLEncodedParams } from "@/lib/helpers/prepareUrlEncodedParams";
import { $fetch } from "@/lib/servicehelpers/fetch";
import { RootState } from "@/redux";
import { useSelector } from "react-redux";




export const getAllFilesAPI = async (page :number ,file_id: string | string[]) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${file_id}/files?page=${page}&limit=10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      return await res.json();
    } catch (err) {
      console.error("Error creating category:", err);
      throw err;
    }
  };


  export const getMyFilesAPI = async (queryParams: any,access_token : string) => {
    try {
       const url = prepareURLEncodedParams(
      `${process.env.NEXT_PUBLIC_API_URL}/files`,
      queryParams
    );
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${access_token}`, 
        },
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      return await res.json();
    } catch (err) {
      console.error("Error creating category:", err);
      throw err;
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