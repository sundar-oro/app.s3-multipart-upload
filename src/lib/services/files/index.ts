export const getAllFilesAPI = async (page :number ) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/[file_id]/files?page=${page}&limit=10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${process.env.NEXT_PUBLIC_API_TOKEN}`, 
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