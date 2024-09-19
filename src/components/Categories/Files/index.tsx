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
import { useEffect, useRef, useState } from "react";
import FileUpload from "./filesupload";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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

  const lastFileRef = useRef<HTMLDivElement>(null);
  const fileListRef = useRef<HTMLDivElement>(null);

  // window.onscroll = () => {
  //   if (
  //     window.innerHeight + document.documentElement.scrollTop ===
  //     document.documentElement.offsetHeight
  //   ) {
  //     if (!noData) {
  //       getAllFiles(page, true);
  //     }
  //   }
  // };

  const { file_id } = useParams();

  const formatSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1048576) {
      // Less than 1 MB and 1048576bytes
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      // 1 MB or more
      return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
    }
  };

  const handleToggle = () => {
    setShowFileUpload((prevState: any) => !prevState);
  };

  const getAllFiles = async (page: number, isScrolling: boolean = false) => {
    try {
      setLoading(true);
      const response = await getAllFilesAPI(page, file_id);

      if (response?.success) {
        const newPage = page + 1;
        const newFileData = response.data;
        // const updatedFilesData = [...filesData, ...newFileData];
        setFilesData((prevFilesData) => [...prevFilesData, ...newFileData]);
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

  useEffect(() => {
    const fileListContainer = fileListRef.current;

    if (!fileListContainer || noData) return;

    const handleScroll = () => {
      if (
        fileListContainer.scrollTop + fileListContainer.clientHeight >=
        fileListContainer.scrollHeight
      ) {
        getAllFiles(page, true); // Load more files
      }
    };

    fileListContainer.addEventListener("scroll", handleScroll);

    return () => {
      fileListContainer.removeEventListener("scroll", handleScroll);
    };
  }, [page, filesData, noData]);

  // useEffect(() => {
  //   if (!lastFileRef.current || noData) return;

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       const target = entries[0];
  //       if (target.isIntersecting) {
  //         getAllFiles(page, true); // Load more files
  //       }
  //     },
  //     { threshold: 1.0 }
  //   );

  //   observer.observe(lastFileRef.current);

  //   return () => {
  //     if (lastFileRef.current) {
  //       observer.unobserve(lastFileRef.current);
  //     }
  //   };
  // }, [page, filesData, noData]);

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log("fdslafkd9irew");
    const fileType = event.currentTarget.getAttribute("data-file-type");
    console.log(fileType, "yestsest");

    if (fileType == "image") {
      event.currentTarget.src = "/dashboard/stats/image.svg";
    } else if (fileType === "pdf") {
      event.currentTarget.src = "/dashboard/stats/pdf.svg";
    } else if (fileType === "document") {
      event.currentTarget.src = "/dashboard/stats/docs.svg";
    } else if (fileType === "video") {
      event.currentTarget.src = "/dashboard/stats/video.svg";
    } else {
      event.currentTarget.src = "/dashboard/stats/others.svg";
    }
  };

  // const handleImageError = (
  //   event: React.SyntheticEvent<HTMLImageElement, Event>
  // ) => {
  //   const mimeType = event.currentTarget.getAttribute("data-file-type");

  //   if (mimeType?.startsWith("image/")) {
  //     event.currentTarget.src = "/dashboard/stats/image.svg"; // Fallback for images
  //   } else if (mimeType === "application/pdf") {
  //     event.currentTarget.src = "/dashboard/stats/pdf.svg"; // Fallback for PDF
  //   } else if (
  //     mimeType === "application/msword" ||
  //     mimeType ===
  //       "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  //   ) {
  //     event.currentTarget.src = "/dashboard/stats/docs.svg"; // Fallback for documents
  //   } else if (mimeType?.startsWith("video/")) {
  //     event.currentTarget.src = "/dashboard/stats/video.svg"; // Fallback for videos
  //   } else {
  //     event.currentTarget.src = "/dashboard/stats/others.svg"; // Fallback for other file types
  //   }
  // };

  const renderFilePreview = (file: FileData) => {
    const mimeType = file.mime_type;

    if (mimeType.includes("image")) {
      return (
        <img
          src={"/dashboard/stats/image.svg"}
          alt={file.name}
          data-file-type="image"
          width={60}
          height={60}
          className="rounded-lg"
        />
      );
    }

    if (mimeType.includes("video/")) {
      return (
        <>
          {/* <video width={60} height={60} controls>
            <source src={file.url} type={mimeType} />
            Your browser does not support the video tag.
          </video> */}
          <img
            src={"/dashboard/stats/video.svg"}
            alt={file.name}
            data-file-type="video"
            width={60}
            height={60}
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
        />
      );
    }

    return (
      <img
        src="/dashboard/stats/others.svg"
        alt={file.name}
        data-file-type="others"
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
            ref={fileListRef} // Ref for scrolling
            className={`grid gap-10 transition-all duration-300 ${
              showFileUpload ? "grid-cols-3" : "grid-cols-4"
            } flex-grow h-[calc(100vh-5rem)] overflow-y-auto p-4`}
          >
            {filesData.length > 0 ? (
              filesData.map((file, index) => (
                <div
                  key={file.id}
                  ref={index === filesData.length - 1 ? lastFileRef : null} // load more file when reach to last
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

                  <Card className="w-[200px] rounded-lg border border-[#8E8EFC] shadow-none flex flex-col flex items-center ">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 "
                          >
                            {renderFilePreview(file)}
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Name :{file.name}</p>
                          <p>Size :{formatSize(file.size)}</p>
                          <p>Type :{file.mime_type}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* {renderFilePreview(file)} */}
                    <CardFooter className="bg-[#F5F5F5] py-2 w-full flex items-center justify-center">
                      <span className="text-sm font-medium flex ">
                        {truncateFileName(file.name, 10)}
                      </span>
                    </CardFooter>
                  </Card>
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
