import PaginationComponent from "@/components/Core/TablePagination";
import DynamicPagination from "@/components/Core/TablePaginationtest";
import TanStackTable from "@/components/Core/TanstackTable";
import DeleteDialog from "@/components/Core/deleteDialog";
import { FilesTableColumns } from "@/components/Dashboard/FilesTableColoumns";
import { Button } from "@/components/ui/button";
import {
  deleteFilesAPI,
  deleteMyFilesAPI,
  handleDownloadFile,
} from "@/lib/services/files";
import { Download, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const MyListFiles = ({
  filesData,
  loading,
  searchParams,
  getAllMyFiles,
  paginationDetails,
  file_id,
  setLoading,
}: any) => {
  const params = useSearchParams();

  const [fileid, setFileid] = useState(0);
  const [open, setOpen] = useState(false);

  const captureRowPerItems = (value?: number) => {
    getAllMyFiles({
      ...searchParams,
      limit: value,
      page: 1,
    });
  };

  const handleOpen = (id: number) => {
    setOpen(true);
    setFileid(id);
  };

  const handleDeleteClick = async () => {
    setLoading(true);
    try {
      let response;
      if (file_id) {
        response = await deleteFilesAPI(file_id, fileid);
      } else {
        response = await deleteMyFilesAPI(fileid);
      }
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        setOpen(false);
        getAllMyFiles({
          searchValue: params.get("search_string"),
          limit: params.get("limit"),
          page: params.get("page"),
        });
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error("Error deleting file:", err);
      toast.error("Failed to delete file.");
    } finally {
      setLoading(false);
    }
  };

  const filesActions = [
    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      cell: (info: any) => {
        const totalObj = info.getValue();
        return (
          <div className="flex items-center ">
            <ul className="flex items-center">
              <li>
                <a href={info.row.original.url} download="file.txt">
                  <Download className="h-4 w-4" />
                </a>
              </li>

              <li>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpen(info.row.original.file_id)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            </ul>
          </div>
        );
      },
      header: () => <span>Actions</span>,
      footer: (props: any) => props.column.id,
      width: "60px",
      minWidth: "60px",
      maxWidth: "60px",
    },
  ];

  const capturePageNum = (value: number) => {
    getAllMyFiles({
      ...searchParams,
      limit: searchParams.limit as string,
      page: value,
    });
  };

  return (
    <>
      <div className="ml-6 mt-4 p-6 flex-grow  max-h-[60vh]">
        <div className="overflow-x-auto">
          <TanStackTable
            columns={[...FilesTableColumns(), ...filesActions]}
            data={filesData}
            loading={loading}
            searchParams={searchParams}
            getData={getAllMyFiles}
          />
        </div>
        <div className="mb-10 ">
          {/* <PaginationComponent
            captureRowPerItems={captureRowPerItems}
            capturePageNum={capturePageNum}
            paginationDetails={paginationDetails}
          /> */}
          <DynamicPagination
            totalPages={
              paginationDetails?.total_pages || paginationDetails?.count || "0"
            }
            captureRowPerItems={captureRowPerItems}
            capturePageNum={capturePageNum}
            paginationDetails={paginationDetails}
          />
        </div>
      </div>
      <DeleteDialog
        openOrNot={open}
        onCancelClick={() => setOpen(false)}
        label="Are you sure you want to delete this file?"
        onOKClick={handleDeleteClick}
        deleteLoading={loading}
      />
    </>
  );
};
export default MyListFiles;
