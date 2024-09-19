export const getStatsApi = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/storage/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${process.env.NEXT_PUBLIC_API_TOKEN}`, 
        },
      });
  
      if (response.status != 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (err) {
      console.error("Error creating category:", err);
      throw err;
    }
  };