"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getMyFilesAPI } from "@/lib/services/files";
import { RootState } from "@/redux";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TanStackTable from "../Core/TanstackTable";
import { FilesTableColumns } from "./FilesTableColoumns";
import { FileDataDetails } from "@/lib/interfaces";

export const convertToLocalDate = (utcDateString: string | number | Date) => {
  const date = new Date(utcDateString);
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    //timeZoneName: "short",
  });
};

export function DashboardTable() {
  const [page, setPage] = useState(1);
  const params = useSearchParams();

  const [filesData, setFilesData] = useState<FileDataDetails[]>([]);
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
        setFilesData(response?.data?.data);
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
    <div className="flex flex-col px-4">
      <h2 className="text-xl font-semibold mt-2 mb-2"> Recent Files</h2>

      <div className="max-h-[400px] overflow-y-auto">
        <TanStackTable
          columns={FilesTableColumns()}
          data={filesData}
          loading={loading}
          searchParams={searchParams}
          getData={getAllMyFiles}
        />
      </div>
    </div>
  );
}
