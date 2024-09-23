import { $fetch } from "@/lib/servicehelpers/fetch";




// export const getStatsApi = async () => {
//     try {
//       const response = await $fetch(`/categories/storage/user`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `${access_token}`, 
//         },
//       });
  
//       if (response.status != 200) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       return await response.json();
//     } catch (err) {
//       console.error("Error creating category:", err);
//       throw err;
//     }
//   };

  export const getStatsApi = async () => {
    try {
      return await $fetch.get("/categories/storage/user");
    } catch (err) {
      throw err;
    }
  };