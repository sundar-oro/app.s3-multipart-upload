"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { getMyFilesAPI } from "@/lib/services/files";
import { formatSize, truncateFileName } from "../Categories/Files";
import TanStackTable from "../Core/TanstackTable";
import { FilesTableColumns } from "./FilesTableColoumns";
import { useSearchParams } from "next/navigation";

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
  const params = useSearchParams();

  const [filesData, setFilesData] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const user = useSelector((state: RootState) => state?.user);

  const getAllMyFiles = async (page: number) => {
    try {
      setLoading(true);
      const response = await getMyFilesAPI({
        page: 1,
        limit: 10,
        order_by: "uploaded_at",
        order_type: "desc",
        search_string: "",
      });
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

          <div className="overflow-x-auto">
            <TanStackTable
              columns={FilesTableColumns()}
              data={filesData}
              loading={loading}
              searchParams={searchParams}
              getData={getAllMyFiles}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
