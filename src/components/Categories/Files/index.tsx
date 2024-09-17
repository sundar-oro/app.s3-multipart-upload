"use client";
import { PanelLeft } from "lucide-react";

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
import { getAllFilesAPI } from "@/lib/services/files";
import { useEffect, useState } from "react";
import FileUpload from "./filesupload";

interface FileData {
  id: string;
  name: string;
  mime_type: string;
  type: string;
  size: number;
  status: string;
  url: string;
}

const truncateFileName = (name: string, maxLength: number) => {
  // Remove the extension
  const baseName = name.split(".")[0]; // Get the part before the file extension
  if (baseName.length <= maxLength) {
    return baseName;
  }
  return `${baseName.substring(0, maxLength)}...`; // Truncate after maxLength and add '...'
};

const Files = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [filesData, setFilesData] = useState<FileData[]>([]); // State for file list
  const [categoryId, setCategoryId] = useState<number | null>(null); // Keep track of category ID
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  const { file_id } = useParams();

  const formatSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1048576) {
      // Less than 1 MB and 1048576bytes
      return `${(sizeInBytes / 1024).toFixed(2)} KB`; // Convert to KB
    } else {
      // 1 MB or more
      return `${(sizeInBytes / 1048576).toFixed(2)} MB`; // Convert to MB
    }
  };

  const handleToggle = () => {
    setShowFileUpload((prevState: any) => !prevState);
  };

  const getAllFiles = async (page: number) => {
    try {
      setLoading(true);
      const response = await getAllFilesAPI(page, file_id);

      if (response?.success) {
        const newPage = page + 1;
        const newFileData = response.data;
        // const updatedFilesData = [...filesData, ...newFileData];
        setFilesData(newFileData);
        setPage(newPage);

        if (newFileData.length === 0) {
          setNoData(true);
        }
      } else {
        // throw new Error(response.message || "Failed to load files");
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
      const id = Array.isArray(file_id) ? file_id[0] : file_id;
      setCategoryId(parseInt(id));
    }
  }, []);

  // const handleImageError = (
  //   event: React.SyntheticEvent<HTMLImageElement, Event>
  // ) => {
  //   const fileType = event.currentTarget.getAttribute("data-file-type");
  //   if (fileType === "image") {
  //     event.currentTarget.src = "/dashboard/stats/image.svg";
  //   } else if (fileType === "pdf") {
  //     event.currentTarget.src = "/dashboard/stats/pdf.svg";
  //   } else if (fileType === "document") {
  //     event.currentTarget.src = "/dashboard/stats/docs.svg";
  //   } else if (fileType === "media") {
  //     event.currentTarget.src = "/dashboard/stats/video.svg";
  //   } else {
  //     event.currentTarget.src = "/dashboard/stats/other.svg";
  //   }
  // };

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const mimeType = event.currentTarget.getAttribute("data-file-type");

    if (mimeType?.startsWith("image/")) {
      event.currentTarget.src = "/dashboard/stats/image.svg"; // Fallback for images
    } else if (mimeType === "application/pdf") {
      event.currentTarget.src = "/dashboard/stats/pdf.svg"; // Fallback for PDF
    } else if (
      mimeType === "application/msword" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      event.currentTarget.src = "/dashboard/stats/docs.svg"; // Fallback for documents
    } else if (mimeType?.startsWith("video/")) {
      event.currentTarget.src = "/dashboard/stats/video.svg"; // Fallback for videos
    } else {
      event.currentTarget.src = "/dashboard/stats/other.svg"; // Fallback for other file types
    }
  };

  const renderFilePreview = (file: FileData) => {
    const mimeType = file.mime_type;
    const isImage = mimeType.startsWith("image/");
    console.log(isImage);

    const isVideo = mimeType.startsWith("video/");
    console.log(isVideo);

    const isPdf = mimeType == "application/pdf";
    console.log(isPdf);

    const isDoc =
      mimeType === "application/msword" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const isOthers = !isImage && !isVideo && !isPdf && !isDoc;
    console.log(isOthers);

    if (mimeType.startsWith("image/")) {
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

    if (mimeType.startsWith("video/")) {
      return (
        <>
          {/* <video width={60} height={60} controls>
            <source src={file.url} type={mimeType} />
            Your browser does not support the video tag.
          </video> */}
          <img
            src={file.url}
            alt={file.name}
            data-file-type="video"
            width={60}
            height={60}
            onError={handleImageError}
          />
        </>
      );
    }

    if (mimeType == "application/pdf") {
      return (
        <img
          src="/dashboard/stats/pdf.svg"
          alt={file.name}
          data-file-type="pdf"
          width={60}
          height={60}
          className="rounded-lg"
          onError={handleImageError}
        />
      );
    }

    if (mimeType === "application/msword") {
      return (
        <img
          src="/dashboard/stats/docs.svg"
          alt={file.name}
          data-file-type="document"
          width={60}
          height={60}
          className="rounded-lg"
          onError={handleImageError}
        />
      );
    }

    return (
      <img
        src="/dashboard/stats/others.svg"
        alt={file.name}
        data-file-type="other"
        width={60}
        height={60}
        className="rounded-lg"
        onError={handleImageError}
      />
    );
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar - sticky */}
      <div className="sticky top-0 left-0 h-screen w-50 bg-white">
        <SideBar categoryid={categoryId} />
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
        </header>

        <div className="flex">
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

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>{renderFilePreview(file)}</TooltipTrigger>
                      <TooltipContent>
                        <p>Name :{file.name}</p>
                        <p>Size :{formatSize(file.size)}</p>
                        <p>Type :{file.type}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* {renderFilePreview(file)} */}
                  <span className="text-lg font-medium text-center">
                    {truncateFileName(file.name, 10)}
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
              className=" right-0 top-0 w-85 h-20   transition-all duration-300"
              style={{ zIndex: 1000 }}
            >
              <FileUpload
                showFileUpload={showFileUpload}
                setShowFileUpload={setShowFileUpload}
                getAllFiles={getAllFiles}
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
