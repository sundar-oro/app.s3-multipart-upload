export const getAuthApi = async (email: string, password: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

























// import { $loginFetch } from "@/lib/servicehelpers/fetch";

// export const getAuthApi = async () => {
//   try {
//     return await $loginFetch.get(`/users/signin`);
//   } catch (err) {
//     throw err;
//   }
// };