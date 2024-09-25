import { apiPropsForQuaryParams } from "@/lib/helpers/Core/prepareQueryParams";
import { createcategory } from "@/lib/interfaces";
import { $fetch } from "@/lib/servicehelpers/fetch";

export const getAllCategoriesAPI = async (
  params: Partial<apiPropsForQuaryParams>
) => {
  try {
    return await $fetch.get("/categories", params);
  } catch (err) {
    throw err;
  }
};

export const getSelectAllCategoriesAPI = async () => {
  try {
    return await $fetch.get("/categories/dropdown/all");
  } catch (err) {
    throw err;
  }
};

export const getDashCategoriesApi = async (
  params: Partial<apiPropsForQuaryParams>
) => {
  try {
    return await $fetch.get("/categories", params);
  } catch (err) {
    throw err;
  }
};

export const getAllReviewsAPI: any = async (params: any) => {
  try {
    return await $fetch.get("/review", params);
  } catch (err) {
    throw err;
  }
};

export const postCreateCategoryAPI = async (payload: createcategory) => {
  try {
    return await $fetch.post("/categories", payload);
  } catch (err) {
    console.error();
  }
};

export const deleteCategoryAPI = async (id: number) => {
  try {
    return await $fetch.delete(`/categories/${id}`);
  } catch (err) {
    throw err;
  }
};

export const getSingleCategoryAPI = async (id: number) => {
  try {
    return await $fetch.get(`/categories/${id}`);
  } catch (err) {
    throw err;
  }
};

export const updateCategoryAPI = async (
  id: number,
  payload: Partial<createcategory>
) => {
  try {
    return await $fetch.put(`/categories/${id}`, payload);
  } catch (err) {
    throw err;
  }
};

// export const getAllCategoriesAPI = async (page :number) => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?page=${page}&limit=10`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `${process.env.NEXT_PUBLIC_API_TOKEN}`,
//         },
//       });

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       return await res.json();
//     } catch (err) {
//       console.error("Error creating category:", err);
//       throw err;
//     }
//   };

// export const deleteCategoryAPI = async (id: number) => {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
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

// export const getSingleCategoryAPI = async (id: number) => {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
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

// export const updateCategoryAPI = async (id: number,payload: Partial<createcategory>) => {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `${process.env.NEXT_PUBLIC_API_TOKEN}`,
//       },
//       body : JSON.stringify(payload)
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

// export const postCreateCategoryAPI = async (payload: createcategory) => {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `${process.env.NEXT_PUBLIC_API_TOKEN}`,
//       },
//       body: JSON.stringify(payload),
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
