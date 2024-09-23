"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { getMyFilesAPI } from "@/lib/services/files";
import { formatSize, truncateFileName } from "../Categories/Files";

export const convertToLocalDate = (utcDateString: string | number | Date) => {
  const date = new Date(utcDateString);
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    //timeZoneName: "short",
  });
};
interface FileData {
  title: string;
  uploaded_at: number;
  category_id: number;
  id: string;
  name: string;
  mime_type: string;
  type: string;
  size: number;
  status: string;
  url: string;
}

export function DashboardTable() {
  const [page, setPage] = useState(1);
  const [filesData, setFilesData] = useState<FileData[]>([]); // State for file list
  const [loading, setLoading] = useState(false);

  const user = useSelector((state: RootState) => state?.user);

  const getAllMyFiles = async (page: number) => {
    try {
      setLoading(true);
      const response = await getMyFilesAPI(page, user?.access_token);
      if (response?.success) {
        setFilesData(response.data);
        setPage(page + 1);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllMyFiles(page);
  }, []);

  return (
    <div className="flex flex-col ">
      <Card className="bg-white shadow-lg rounded-lg">
        <CardContent>
          <h2 className="text-xl font-semibold mt-4 mb-4"> Recent Files</h2>

          <div className="overflow-x-auto max-h-[400px]">
            <Table>
              <TableBody>
                {filesData.length > 0 ? (
                  filesData.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>
                        <div className="font-semibold text-gray-800">
                          {truncateFileName(file.title, 12)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {convertToLocalDate(file.uploaded_at)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        Category {file.category_id}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatSize(file.size)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      {loading ? "Loading..." : "No files available"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
