"use client";
import Image from "next/image";
import { Folder, PanelLeft, Search } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { SideBar } from "@/components/Dashboard/sidebar";
import { StorageStats } from "@/components/Dashboard/storagestats";
import { statsData } from "@/components/Dashboard/dummydata";

import { useEffect, useState } from "react";
import FileUpload from "./filesupload";
import { getAllFilesAPI } from "@/lib/services/files";

interface FileData {
  id: string;
  name: string;
  mime_type: string;
  type: string;
  size: number;
  status: string;
  url: string;
}

const Files = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [filesData, setFilesData] = useState<FileData[]>([]); // State for file list
  const [categoryId, setCategoryId] = useState<string>(""); // Keep track of category ID
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  const handleToggle = () => {
    setShowFileUpload((prevState: any) => !prevState);
  };

  const getAllFiles = async (page: number) => {
    try {
      setLoading(true);
      const response = await getAllFilesAPI(page);

      if (response?.success) {
        const newPage = page + 1;
        const newFileData = response.data;
        const updatedFilesData = [...filesData, ...newFileData];
        setFilesData(updatedFilesData);
        setPage(newPage);

        if (newFileData.length === 0) {
          setNoData(true);
        }
      } else {
        throw new Error(response.message || "Failed to load files");
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllFiles(page);
  }, []); // Fetch files on component mount

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const fileType = event.currentTarget.getAttribute("data-file-type");
    if (fileType === "image") {
      event.currentTarget.src = "/dashboard/stats/image.svg";
    } else if (fileType === "pdf") {
      event.currentTarget.src = "/dashboard/stats/pdf.svg";
    } else if (fileType === "document") {
      event.currentTarget.src = "/dashboard/stats/docs.svg";
    } else if (fileType === "video") {
      event.currentTarget.src = "/dashboard/stats/video.svg";
    } else {
      event.currentTarget.src = "/dashboard/stats/other.svg";
    }
  };

  const renderFilePreview = (file: FileData) => {
    const mimeType = file.mime_type;
    const isImage = mimeType.startsWith("image/");
    const isVideo = mimeType.startsWith("video/");
    const isPdf = mimeType === "application/pdf";
    const isDoc =
      mimeType === "application/msword" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (isImage) {
      return (
        <img
          src={file.url}
          alt={file.name}
          data-file-type="image"
          width={60}
          height={60}
          onError={handleImageError}
          className="rounded-lg"
        />
      );
    }

    if (isVideo) {
      return (
        <video width={60} height={60} controls>
          <source src={file.url} type={mimeType} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (isPdf) {
      return (
        <img
          src="/dashboard/stats/pdf.svg"
          alt={file.name}
          data-file-type="pdf"
          width={60}
          height={60}
          className="rounded-lg"
        />
      );
    }

    if (isDoc) {
      return (
        <img
          src="/dashboard/stats/docs.svg"
          alt={file.name}
          data-file-type="document"
          width={60}
          height={60}
          className="rounded-lg"
        />
      );
    }

    return (
      <img
        src="/dashboard/stats/other.svg"
        alt={file.name}
        data-file-type="other"
        width={60}
        height={60}
        className="rounded-lg"
      />
    );
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar - sticky */}
      <div className="sticky top-0 left-0 h-screen w-50 bg-white">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col bg-muted/40">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs"></SheetContent>
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
                <BreadcrumbLink href="/files"> Files</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="/dashboard/dashboard-avatar.svg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="flex mt-10">
          {/* File List */}
          <div
            className={`grid gap-10 transition-all duration-300 ${
              showFileUpload ? "grid-cols-3" : "grid-cols-4"
            } flex-grow`}
          >
            {filesData.length > 0 ? (
              filesData.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col items-center space-y-2"
                >
                  {/* <img
                    src={file.url}
                    alt={file.name}
                    data-file-type={file.type}
                    width={60}
                    height={60}
                    onError={handleImageError}
                    className="rounded-lg"
                  /> */}

                  {renderFilePreview(file)}
                  <span className="text-lg font-medium text-center">
                    {file.name}
                  </span>
                </div>
              ))
            ) : (
              <div></div>
            )}
          </div>

          {/* File Upload Section */}
          {showFileUpload && (
            <div
              // className=" right-0 top-0 w-85 h-20   transition-all duration-300"
              style={{ zIndex: 1000 }}
            >
              <FileUpload
                showFileUpload={showFileUpload}
                setShowFileUpload={setShowFileUpload}
              />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="fixed bottom-20 right-20">
          <button
            onClick={handleToggle}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-700 focus:outline-none"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default Files;
