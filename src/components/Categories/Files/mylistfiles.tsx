import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileData } from "@/lib/interfaces/files";
import { getMyFilesAPI } from "@/lib/services/files";
import { RootState } from "@/redux";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatSize, truncateFileName } from ".";
import { convertToLocalDate } from "@/components/Dashboard/dashboardtable";
import { Table2 } from "lucide-react";
import TanStackTableComponent from "@/components/TanStackTableComponent";
import { columns } from "@/components/Columns";
import PaginationComponent from "@/components/PaginationComponent";

type MyListFilesParams = {
  page?: number;
  limit?: number;
  filesData?: FileData[];
};

const MyListFiles = ({
  page = 1,
  limit = 10,
  filesData,
}: MyListFilesParams) => {
  const [paginationDetails, setPaginationDetails] = useState({
    page: 1,
    limit: 10,
    total_pages: 1,
    total: 0,
  });

  const handlePageChange = (newPage: number) => {
    MyListFiles({ page: newPage });
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setPaginationDetails({ ...paginationDetails, limit: newLimit, page: 1 }); // Reset page to 1
    MyListFiles({ limit: newLimit });
  };

  return (
    <div className=" mt-10 flex-grow flex flex-col justify-between p-6 ">
      <h1>
        <strong>Recent Files</strong>
      </h1>

      <TanStackTableComponent
        columns={[...columns]} //...actions
        data={filesData}
        getData={MyListFiles}
      />
      <PaginationComponent
        page={paginationDetails.page}
        total_pages={paginationDetails.total_pages}
        total={paginationDetails.total}
        onPageChange={handlePageChange}
        itemsPerPage={paginationDetails.limit}
        onChangeItemsPerPage={handleItemsPerPageChange}
      />
    </div>
  );
};
export default MyListFiles;
