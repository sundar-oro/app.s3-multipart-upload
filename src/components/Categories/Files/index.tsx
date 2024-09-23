"use client";
import { ListOrdered, PanelLeft, Table2, Plus } from "lucide-react";
import { SideBar } from "@/components/Dashboard/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useParams, useRouter } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAllFilesAPI, getMyFilesAPI } from "@/lib/services/files";
import { useEffect, useRef, useState } from "react";
import FileUpload from "./filesupload";
import { Card, CardFooter } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import CategoriesSideBar from "@/components/Dashboard/categoriesSidebar";

interface FileData {
  id: string;
  name: string;
  mime_type: string;
  type: string;
  size: number;
  status: string;
  url: string;
}

import MyListFiles from "./mylistfiles";
import Loading from "@/components/Core/loading";
import MultiPartUploadComponent from "@/components/MultipartUpload/MultiPartUpload";

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
  const [page, setPage] = useState(1);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [filesData, setFilesData] = useState<FileData[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [listView, setListView] = useState(true); // Start with list view by default
  const [showMultipartUpload, setShowMultipartUpload] = useState(false); // Multipart Upload State

  const lastFileRef = useRef<HTMLDivElement>(null);
  const fileListRef = useRef<HTMLDivElement>(null);
  const { file_id } = useParams();
  const user = useSelector((state: RootState) => state?.user);

  const handleToggle = () => {
    setShowFileUpload((prevState: any) => !prevState);
  };

  const handleMultipartUploadToggle = () => {
    setShowMultipartUpload((prevState) => !prevState);
  };

  const getAllFiles = async (page: number, isScrolling: boolean = false) => {
    try {
      setLoading(true);
      const response = await getAllFilesAPI(page, file_id);

      if (response?.success) {
        setFilesData((prevFilesData) => [...prevFilesData, ...response.data]);
        setPage(page + 1);

        if (response.data.length === 0) {
          setNoData(true);
        }
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAllMyFiles = async (page: number, isScroll: boolean = false) => {
    try {
      setLoading(true);
      const response = await getMyFilesAPI(page, user?.access_token);

      if (response?.success) {
        setFilesData((prevFilesData) => [...prevFilesData, ...response.data]);
        setPage(page + 1);

        if (response.data.length === 0) {
          setNoData(true);
        }
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (file_id) {
      getAllFiles(page);
      setCategoryId(parseInt(Array.isArray(file_id) ? file_id[0] : file_id));
    } else {
      getAllMyFiles(page);
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
        file_id ? getAllFiles(page, true) : getAllMyFiles(page, true);
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

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Categories</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/files">Files</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

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

              <MyListFiles filesData={filesData} />
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="fixed bottom-6 right-6 space-x-4 flex">
          <Button
            variant="outline"
            className="shadow-lg"
            onClick={handleToggle}
          >
            +
          </Button>
          <Button
            variant="outline"
            className="shadow-lg"
            onClick={handleMultipartUploadToggle}
          >
            Multipart Upload
          </Button>
        </div>

        {/* File Upload Section */}
        {showFileUpload && (
          <div className="fixed inset-0 bg-white z-50 p-6">
            {/* <FileUpload /> */}
            <Button onClick={handleToggle}>Close</Button>
          </div>
        )}

        {/* Multipart Upload Section */}
        {showMultipartUpload && (
          <div className="fixed inset-0 bg-white z-50 p-6">
            <MultiPartUploadComponent />
            <Button onClick={handleMultipartUploadToggle}>Close</Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Files;
