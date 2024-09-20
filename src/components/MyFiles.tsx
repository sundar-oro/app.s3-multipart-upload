import { getFilesAPI } from "@/lib/services/files";
import React, { useEffect, useState } from "react";

const MyFiles = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch files from the API
  const getFiles = async () => {
    try {
      const response = await getFilesAPI();

      setFiles(response.data); // Assuming 'files' is the key in the response containing file info
    } catch (error) {
      setError("Error fetching files");
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  return <div>My files</div>;
};

export default MyFiles;
