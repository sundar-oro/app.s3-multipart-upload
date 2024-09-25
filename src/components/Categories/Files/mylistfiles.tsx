import PaginationComponent from "@/components/Core/TablePagination";
import DynamicPagination from "@/components/Core/TablePaginationtest";
import TanStackTable from "@/components/Core/TanstackTable";
import DeleteDialog from "@/components/Core/deleteDialog";
import { FilesTableColumns } from "@/components/Dashboard/FilesTableColoumns";
import { Button } from "@/components/ui/button";
import {
  deleteFilesAPI,
  deleteMyFilesAPI,
  getSingleFileAPI,
  handleDownloadFile,
  updateFileAPI,
} from "@/lib/services/files";
import { Download, Edit, Edit2, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { title } from "process";
import { useState } from "react";
import { toast } from "sonner";
import { FilePenLine } from "lucide-react";
import AddDialog from "@/components/Core/CreateDialog";

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
  const [categoryId, setCategoryId] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileUpdateOpen, setFileUpdateOpen] = useState(false);
  const [name, setName] = useState("");
  const [errMessages, setErrMessages] = useState<any>({});

  const captureRowPerItems = (value?: number) => {
    getAllMyFiles({
      ...searchParams,
      limit: value,
      page: 1,
    });
  };

  const handleDeleteDialogOpen = (id: number) => {
    setDeleteDialogOpen(true);
    setFileid(id);
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setName(value);
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
        setDeleteDialogOpen(false);
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

  const getSingleFileDetails = async (categoryid: number, fileid: number) => {
    setLoading(true);
    try {
      const response = await getSingleFileAPI(categoryid, fileid);

      if (response?.status == 200 || response?.status == 201) {
        console.log(response?.data?.data?.title);
        setName(response?.data?.data?.title);
        setFileid(fileid);
        setCategoryId(categoryid);
        setFileUpdateOpen(true);
      } else {
        throw response;
      }
    } catch (err: any) {
      // errorPopper(err);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async () => {
    setLoading(true);
    try {
      const payload = {
        title: name,
      };
      const response: any = await updateFileAPI(categoryId, fileid, payload);

      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.data?.message);
        setFileUpdateOpen(false);
        setFileid(0);
        setCategoryId(0);
        setName("");
        getAllMyFiles({
          searchValue: params.get("search_string"),
          limit: params.get("limit"),
          page: params.get("page"),
        });
      } else if (response.status === 422) {
        setErrMessages(response?.data?.errors);
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err);
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    getSingleFileDetails(
                      info.row.original.category_id,
                      info.row.original.file_id
                    )
                  }
                  title="Edit"
                >
                  <FilePenLine className="h-4 w-4" />
                </Button>
              </li>
              <li>
                <a href={info.row.original.url} download="file.txt">
                  <Download className="h-4 w-4" />
                </a>
              </li>

              <li>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleDeleteDialogOpen(info.row.original.file_id)
                  }
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
        openOrNot={deleteDialogOpen}
        onCancelClick={() => setDeleteDialogOpen(false)}
        label="Are you sure you want to delete this file?"
        onOKClick={handleDeleteClick}
        deleteLoading={loading}
      />
      <AddDialog
        openOrNot={fileUpdateOpen}
        onCancelClick={() => setFileUpdateOpen(false)}
        title="Update File Title"
        onOKClick={updateCategory}
        placeholder="Enter another Name for File"
        createLoading={loading}
        handleTextFieldChange={handleTextFieldChange}
        value={name}
        errMessage={errMessages?.title}
        buttonName="Rename"
      />
    </>
  );
};
export default MyListFiles;
