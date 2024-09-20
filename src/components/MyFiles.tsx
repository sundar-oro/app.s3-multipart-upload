// "use client";

// import { getMyFilesAPI } from "@/lib/services/files";
// import React, { useEffect, useRef, useState } from "react";
// import { SideBar } from "./Dashboard/sidebar";

// import { Card, CardFooter } from "./ui/card";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "./ui/tooltip";

// interface FileData {
//   id: string;
//   name: string;
//   mime_type: string;
//   type: string;
//   size: number;
//   status: string;
//   url: string;
// }

// const truncateFileName = (name: string, maxLength: number) => {
//   // Remove the extension
//   const baseName = name.split(".")[0]; // Get the part before the file extension
//   if (baseName.length <= maxLength) {
//     return baseName;
//   }
//   return `${baseName.substring(0, maxLength)}...`; // Truncate after maxLength and add '...'
// };

// const MyFiles = async () => {
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [filesData, setFilesData] = useState<FileData[]>([]); // State for file list
//   const [noData, setNoData] = useState(false);

//   const lastFileRef = useRef<HTMLDivElement>(null);
//   const fileListRef = useRef<HTMLDivElement>(null);

//   const formatSize = (sizeInBytes: number) => {
//     if (sizeInBytes < 1048576) {
//       // Less than 1 MB and 1048576bytes
//       return `${(sizeInBytes / 1024).toFixed(2)} KB`;
//     } else {
//       // 1 MB or more
//       return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
//     }
//   };

//   const getmyFiles = async (page: number, isScrolling: boolean = false) => {
//     try {
//       setLoading(true);
//       const response = await getMyFilesAPI(page);

//       if (response?.success) {
//         const newPage = page + 1;
//         const newFileData = response.data;
//         // const updatedFilesData = [...filesData, ...newFileData];
//         setFilesData((prevFilesData) => [...prevFilesData, ...newFileData]);
//         setPage(newPage);

//         if (newFileData.length === 0) {
//           setNoData(true);
//         }
//       } else {
//         // throw new Error(response.message || "Failed to load files");
//       }
//     } catch (err) {
//       console.error("Error fetching files:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getmyFiles(page);
//   }, []);

//   useEffect(() => {
//     const fileListContainer = fileListRef.current;

//     if (!fileListContainer || noData) return;

//     const handleScroll = () => {
//       if (
//         fileListContainer.scrollTop + fileListContainer.clientHeight >=
//         fileListContainer.scrollHeight
//       ) {
//         getmyFiles(page, true); // Load more files
//       }
//     };

//     fileListContainer.addEventListener("scroll", handleScroll);

//     return () => {
//       fileListContainer.removeEventListener("scroll", handleScroll);
//     };
//   }, [page, filesData, noData]);

//   const renderFilePreview = (file: FileData) => {
//     const mimeType = file.mime_type;

//     if (mimeType.includes("image")) {
//       return (
//         <img
//           src={"/dashboard/stats/image.svg"}
//           alt={file.name}
//           data-file-type="image"
//           width={60}
//           height={60}
//           className="rounded-lg"
//         />
//       );
//     }

//     if (mimeType.includes("video/")) {
//       return (
//         <>
//           {/* <video width={60} height={60} controls>
//             <source src={file.url} type={mimeType} />
//             Your browser does not support the video tag.
//           </video> */}
//           <img
//             src={"/dashboard/stats/video.svg"}
//             alt={file.name}
//             data-file-type="video"
//             width={60}
//             height={60}
//           />
//         </>
//       );
//     }

//     if (mimeType == "application/pdf") {
//       return (
//         <img
//           src="/dashboard/stats/pdf.svg"
//           alt={file.name}
//           data-file-type="pdf"
//           width={60}
//           height={60}
//           className="rounded-lg"
//         />
//       );
//     }

//     if (mimeType === "application/msword") {
//       return (
//         <img
//           src="/dashboard/stats/docs.svg"
//           alt={file.name}
//           data-file-type="document"
//           width={60}
//           height={60}
//           className="rounded-lg"
//         />
//       );
//     }

//     return (
//       <img
//         src="/dashboard/stats/others.svg"
//         alt={file.name}
//         data-file-type="others"
//         width={60}
//         height={60}
//         className="rounded-lg"
//       />
//     );
//   };

//   return (
//     <div className="flex min-h-screen w-full">
//       {/* Sidebar - sticky */}
//       <div className="sticky top-0 left-0 h-screen w-50 bg-white">
//         <SideBar />
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-1 flex-col bg-muted/40">
//         <div className="flex">
//           {/* File List */}
//           <div
//             ref={fileListRef} // Ref for scrolling
//             className={`grid gap-10 transition-all duration-300`} //${
//             //   showFileUpload ? "grid-cols-3" : "grid-cols-4"
//             // } flex-grow h-[calc(100vh-5rem)] overflow-y-auto p-4`}
//           >
//             {filesData.length > 0 ? (
//               filesData.map((file, index) => (
//                 <div
//                   key={file.id}
//                   ref={index === filesData.length - 1 ? lastFileRef : null} // load more file when reach to last
//                   className="flex flex-col items-center space-y-2"
//                 >
//                   <Card className="w-[200px] rounded-lg border border-[#8E8EFC] shadow-none flex flex-col flex items-center ">
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <a
//                             href={file.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-12 h-12 "
//                           >
//                             {renderFilePreview(file)}
//                           </a>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>Name :{file.name}</p>
//                           <p>Size :{formatSize(file.size)}</p>
//                           <p>Type :{file.mime_type}</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>

//                     {/* {renderFilePreview(file)} */}
//                     <CardFooter className="bg-[#F5F5F5] py-2 w-full flex items-center justify-center">
//                       <span className="text-sm font-medium flex ">
//                         {truncateFileName(file.name, 10)}
//                       </span>
//                     </CardFooter>
//                   </Card>
//                 </div>
//               ))
//             ) : (
//               <div></div>
//             )}
//           </div>
//         </div>

//         {/* Upload Button */}
//       </div>
//     </div>
//   );
// };
// export default MyFiles;
