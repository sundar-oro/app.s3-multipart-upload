"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ListOrdered, PanelLeft, Table2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { getAllFilesAPI, getMyFilesAPI } from "@/lib/services/files";
import { RootState } from "@/redux";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface FileData {
  id: string;
  name: string;
  mime_type: string;
  type: string;
  size: number;
  status: string;
  url: string;
}

import MultiPartUploadComponent from "@/components/MultipartUpload/MultiPartUpload";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import FileUpload from "./filesupload";
import MyListFiles from "./mylistfiles";

// Helper functions for file name truncation and size formatting
export const truncateFileName = (name: string, maxLength: number) => {
  const baseName = name.split(".")[0];
  return baseName.length <= maxLength
    ? baseName
    : `${baseName.substring(0, maxLength)}...`;
};

export const formatSize = (sizeInBytes: number) => {
  return sizeInBytes < 1048576
    ? `${(sizeInBytes / 1024).toFixed(2)} KB`
    : `${(sizeInBytes / 1048576).toFixed(2)} MB`;
};

const Files = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [page, setPage] = useState(1);
  const [showFileUpload, setShowFileUpload] = useState<any>(false);
  const [filesData, setFilesData] = useState<FileData[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [listView, setListView] = useState(true);
  const [showMultipartUpload, setShowMultipartUpload] = useState(false);
  const [paginationDetails, setPaginationDetails] = useState({});

  const lastFileRef = useRef<HTMLDivElement>(null);
  const fileListRef = useRef<HTMLDivElement>(null);
  const { file_id } = useParams();
  const user = useSelector((state: RootState) => state?.user);
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const handleToggle = () => {
    setShowFileUpload((prevState: any) => !prevState);
  };

  const handleMultipartUploadToggle = () => {
    setShowMultipartUpload((prevState) => !prevState);
    handleToggle();
  };

  const getAllFiles = async ({
    page = params.get("page") as string,
    limit = params.get("limit") as string,
    orderBy = params.get("order_by") as string,
    orderType = params.get("order_type") as string,
    searchValue = params.get("search_string") as string,
  }: any) => {
    let queryParams: any = {
      page: page ? page : 1,
      limit: limit ? limit : 10,
    };
    if (searchValue) {
      queryParams["search_string"] = searchValue;
    }
    if (orderBy) {
      queryParams["order_by"] = orderBy;
    }
    if (orderType) {
      queryParams["order_type"] = orderType;
    }
    try {
      setLoading(true);
      const response = await getAllFilesAPI(queryParams, file_id);

      if (response?.success) {
        console.log(response, "Fsdk883282");
        let { data, ...rest } = response.data;
        setPaginationDetails(rest);
        setFilesData(data);
        showFileUpload(false);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAllMyFiles = async ({
    page = params.get("page") as string,
    limit = params.get("limit") as string,
    orderBy = params.get("order_by") as string,
    orderType = params.get("order_type") as string,
    searchValue = params.get("search_string") as string,
  }: any) => {
    try {
      let queryParams: any = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
      };
      if (searchValue) {
        queryParams["search_string"] = searchValue;
      }
      if (orderBy) {
        queryParams["order_by"] = orderBy;
      }
      if (orderType) {
        queryParams["order_type"] = orderType;
      }
      setLoading(true);
      const response = await getMyFilesAPI(queryParams);
      if (response?.success) {
        let { data, ...rest } = response.data;
        setPaginationDetails(rest);
        setFilesData(data);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (file_id) {
      getAllFiles({});
      setCategoryId(parseInt(Array.isArray(file_id) ? file_id[0] : file_id));
    } else {
      getAllMyFiles({});
    }
  }, []);

  useEffect(() => {
    const fileListContainer = fileListRef.current;
    if (!fileListContainer || noData) return;

    const handleScroll = () => {
      if (
        fileListContainer.scrollTop + fileListContainer.clientHeight >=
        fileListContainer.scrollHeight
      ) {
        file_id ? getAllFiles({ page }) : getAllMyFiles({ page });
      }
    };

    fileListContainer.addEventListener("scroll", handleScroll);
    return () => fileListContainer.removeEventListener("scroll", handleScroll);
  }, [page, filesData, noData, file_id]);

  const renderFilePreview = (file: FileData) => {
    const mimeType = file.mime_type;

    const fileIcons = {
      image: "/dashboard/stats/image.svg",
      video: "/dashboard/stats/video.svg",
      pdf: "/dashboard/stats/pdf.svg",
      msword: "/dashboard/stats/docs.svg",
      others: "/dashboard/stats/others.svg",
    };

    if (mimeType.includes("image"))
      return (
        <img src={fileIcons.image} alt={file.name} width={60} height={60} />
      );
    if (mimeType.includes("video"))
      return (
        <img src={fileIcons.video} alt={file.name} width={60} height={60} />
      );
    if (mimeType === "application/pdf")
      return <img src={fileIcons.pdf} alt={file.name} width={60} height={60} />;
    if (mimeType === "application/msword")
      return (
        <img src={fileIcons.msword} alt={file.name} width={60} height={60} />
      );
    return (
      <img src={fileIcons.others} alt={file.name} width={60} height={60} />
    );
  };

  return (
    <>
      <div className="flex min-h-screen w-full bg-muted/40">
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 bg-background px-6 border-b">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left"></SheetContent>
            </Sheet>

            <div className="ml-auto flex space-x-4">
              <Table2
                onClick={() => setListView(true)}
                className="cursor-pointer"
              />
              <ListOrdered
                onClick={() => setListView(false)}
                className="cursor-pointer"
              />
            </div>
          </header>

          {listView ? (
            <div>
              <h2 className="text-xl font-bold  ml-14">My Files</h2>
              {file_id ? (
                <div className="fixed  right-6 space-x-4 flex">
                  <Button
                    variant="outline"
                    className="shadow-lg"
                    onClick={handleToggle}
                  >
                    +
                  </Button>
                  {/* <Button
                    variant="outline"
                    className="shadow-lg"
                    onClick={handleMultipartUploadToggle}
                  >
                    Multipart Upload
                  </Button> */}
                </div>
              ) : (
                ""
              )}
              <MyListFiles
                filesData={filesData}
                loading={loading}
                searchParams={searchParams}
                getAllMyFiles={file_id ? getAllFiles : getAllMyFiles}
                paginationDetails={paginationDetails}
              />
            </div>
          ) : (
            ""
          )}
        </div>

        <div>
          <Dialog
            open={showFileUpload}
            onOpenChange={() => setShowFileUpload(false)}
          >
            <DialogContent className="bg-white w-[80%]">
              <DialogTitle>New FileUpload</DialogTitle>
              {showMultipartUpload ? (
                <MultiPartUploadComponent />
              ) : (
                <FileUpload
                  showFileUpload={showFileUpload}
                  setShowFileUpload={setShowFileUpload}
                  getAllFiles={getAllFiles}
                />
              )}
              <DialogFooter></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default Files;
