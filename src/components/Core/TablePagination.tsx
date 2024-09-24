// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Card } from "../ui/card";
// import { Input } from "../ui/input";

// export const TablePaginationComponent = ({
//   capturePageNum,
//   captureRowPerItems,
//   paginationDetails,
//   limitOptionsFromProps,
//   limitValue,
// }: {
//   capturePageNum: (e: any) => void;
//   captureRowPerItems: (e: any) => void;
//   paginationDetails: any;
//   limitOptionsFromProps?: { title: string; value: number }[] | any;
//   limitValue?: number;
// }) => {
//   const [pageValue, setPageValue] = useState<number>(+paginationDetails?.page);
//   const [totalPages, setTotalPages] = useState(0);
//   const [limitOptions, setLimitOptions] = useState<any[]>([]);

//   const maxVisiblePages = 10; // Set this to your desired number of pages to display

//   const handlePageRowChange = (value: string) => {
//     const numberValue = parseInt(value, 10);
//     if (!isNaN(numberValue)) {
//       captureRowPerItems(numberValue);
//     }
//   };

//   const onKeyDownChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       const newPageValue = Math.max(1, Math.min(totalPages || 1, pageValue));
//       capturePageNum(newPageValue);
//     }
//   };

//   useEffect(() => {
//     setPageValue(paginationDetails?.page || 1);
//     setTotalPages(+paginationDetails?.total_pages || 0);
//   }, [paginationDetails]);

//   useEffect(() => {
//     setLimitOptions(
//       limitOptionsFromProps?.length
//         ? limitOptionsFromProps
//         : [
//             { title: "10/page", value: 10 },
//             { title: "20/page", value: 20 },
//             { title: "50/page", value: 50 },
//             { title: "80/page", value: 80 },
//             { title: "100/page", value: 100 },
//           ]
//     );
//   }, [limitOptionsFromProps]);

//   // Create pagination range logic
//   const getVisiblePages = () => {
//     const start = Math.max(
//       2,
//       paginationDetails.page - Math.floor(maxVisiblePages / 2)
//     ); // Start from 2 since 1 is handled separately
//     const end = Math.min(totalPages, start + maxVisiblePages - 1);
//     return Array.from({ length: end - start + 1 }, (_, i) => start + i);
//   };

//   return (
//     <Card className="flex justify-center items-center p-2 sticky bottom-0 left-0 ">
//       <p className="text-sm font-normal mr-4 text-gray-600 ">
//         Total {paginationDetails?.total || paginationDetails?.count || ""}
//       </p>

//       <Select
//         onValueChange={handlePageRowChange}
//         value={paginationDetails?.limit}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder="Select a Limit" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectGroup>
//             {limitOptions.map((item) => (
//               <SelectItem key={item.value} value={item.value}>
//                 {item.title}
//               </SelectItem>
//             ))}
//           </SelectGroup>
//         </SelectContent>
//       </Select>

//       <Pagination>
//         <PaginationContent>
//           <PaginationItem>
//             <PaginationPrevious
//               onClick={(e) => {
//                 e.preventDefault();
//                 capturePageNum(Math.max(1, paginationDetails.page - 1));
//               }}
//             />
//           </PaginationItem>

//           {paginationDetails.page > 1 && (
//             <>
//               <PaginationItem>
//                 <PaginationLink
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     capturePageNum(1);
//                   }}
//                 >
//                   1
//                 </PaginationLink>
//               </PaginationItem>
//               {paginationDetails.page > 2}
//             </>
//           )}

//           {getVisiblePages().map((number) => (
//             <PaginationItem key={number}>
//               <PaginationLink
//                 href="#"
//                 isActive={number === paginationDetails.page}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   capturePageNum(number);
//                 }}
//               >
//                 {number}
//               </PaginationLink>
//             </PaginationItem>
//           ))}

//           {paginationDetails.page < totalPages && (
//             <>
//               {paginationDetails.page < totalPages - 1}
//               <PaginationItem>
//                 <PaginationLink
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     capturePageNum(totalPages);
//                   }}
//                 >
//                   {totalPages}
//                 </PaginationLink>
//               </PaginationItem>
//             </>
//           )}

//           <PaginationItem>
//             <PaginationNext
//               onClick={(e) => {
//                 e.preventDefault();
//                 capturePageNum(
//                   Math.min(totalPages, paginationDetails.page + 1)
//                 );
//               }}
//             />
//           </PaginationItem>
//         </PaginationContent>
//       </Pagination>

//       <div className="flex items-center gap-2 ">
//         <p className="text-sm font-medium text-gray-600">Go to</p>
//         <Input
//           type="number"
//           value={pageValue}
//           onChange={(e) => setPageValue(Number(e.target.value))}
//           onKeyDown={onKeyDownChange}
//           onWheel={(e) => e.currentTarget.blur()}
//           min={1}
//         />
//       </div>
//     </Card>
//   );
// };
