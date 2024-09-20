// 'use client';

// import { getMyFilesAPI } from '@/lib/services/files';
// import { TooltipProvider, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
// import React, { useEffect, useState } from 'react';

// import { truncateFileName } from '../Categories/Files';
// import { Card, CardFooter } from '../ui/card';
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
// import { Tooltip } from '../ui/tooltip';

// interface FileData {
//   id: string;
//   name: string;
//   mime_type: string;
//   type: string;
//   size: number;
//   status: string;
//   url: string;
// }

// export const carouselcards = () => {
//      const [page, setPage] = useState(1);
//      const [showFileUpload, setShowFileUpload] = useState(false);
//      const [filesData, setFilesData] = useState<FileData[]>([]); // State for file list
//      const [categoryId, setCategoryId] = useState<number | null>(null); // Keep track of category ID
//      const [loading, setLoading] = useState(false);
//      const [noData, setNoData] = useState(false);

//      export default function FileCarousel({ FilesData }) {
//   const [visibleCards, setVisibleCards] = useState(4); // Display 4 cards initially

//   const handleNext = () => {
//     if (visibleCards + 4 <= 10) setVisibleCards(visibleCards + 4); // Up to 10 cards
//   };

//   const handlePrevious = () => {
//     if (visibleCards - 4 >= 4) setVisibleCards(visibleCards - 4); // Minimum 4 cards
//   };

//     const getAllMyFiles = async (
//       page: number,
//       isScrolling: boolean = false
//     ) => {
//       try {
//         setLoading(true);
//         const response = await getMyFilesAPI(page);

//         if (response?.success) {
//           const newPage = page + 1;
//           const newFileData = response.data;
//           // const updatedFilesData = [...filesData, ...newFileData];
//           //setFilesData((prevFilesData) => [...prevFilesData, ...newFileData]);
//           setFilesData(newFileData);
//           setPage(newPage);

//           if (newFileData.length === 0) {
//             setNoData(true);
//           }
//         } else {
//           // throw new Error(response.message || "Failed to load files");
//         }
//       } catch (err) {
//         console.error("Error fetching files:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     useEffect(() => {
//       getAllMyFiles(page);
//     }, []);

//   return (
//     <div className="relative w-full">
//       <Carousel className="w-full max-w-full">
//         <CarouselContent>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {filesData.slice(0, visibleCards).map((file, index) => (
//               <CarouselItem key={index}>
//                 <Card className="w-[200px] rounded-lg border border-[#8E8EFC] shadow-none flex flex-col items-center">
//                   <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <a
//                           href={file.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="w-12 h-12"
//                         >
//                           {renderFilePreview(file)}
//                         </a>
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>Name: {file.name}</p>
//                         <p>Size: {formatSize(file.size)}</p>
//                         <p>Type: {file.mime_type}</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>

//                   <CardFooter className="bg-[#F5F5F5] py-2 w-full flex items-center justify-center">
//                     <span className="text-sm font-medium">
//                       {truncateFileName(file.name, 10)}
//                     </span>
//                   </CardFooter>
//                 </Card>
//               </CarouselItem>
//             ))}
//           </div>
//         </CarouselContent>

//         {/* Carousel Previous and Next Buttons */}
//         {visibleCards < 10 && (
//           <CarouselNext
//             onClick={handleNext}
//             className="absolute right-0 top-1/2 transform -translate-y-1/2"
//           >
//             Next
//           </CarouselNext>
//         )}

//         {visibleCards > 4 && (
//           <CarouselPrevious
//             onClick={handlePrevious}
//             className="absolute left-0 top-1/2 transform -translate-y-1/2"
//           >
//             Previous
//           </CarouselPrevious>
//         )}
//       </Carousel>
//     </div>
//   );
// };
