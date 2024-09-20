// "use client";
// import { Progress } from "@/components/ui/progress";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import NextImage from "next/image";
// import { DockIcon, File, Image, LucideDock, Video } from "lucide-react";

// export function StorageStats() {
//   return (
//     <div>
//       <Card className="overflow-hidden bg-white shadow-lg p-4">
//         <CardHeader>
//           <CardTitle>Storage Stats</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-lg font-semibold">
//             Total Storage: {data?.totalStorageInMB ? data?.totalStorageInMB : 0}{" "}
//             MB
//           </p>

//           <h3 className="mt-4 mb-2 font-semibold">Storage Breakdown:</h3>

//           <ul className="space-y-3">
//             <li className="flex justify-between">
//               <div>
//                 <span>Images</span>
//                 <div>{data?.storageBreakdown?.image?.count || 0} files</div>
//                 <br />
//               </div>
//               <span>
//                 {bytesToMB(data?.storageBreakdown?.image?.storage || 0)} MB
//               </span>
//             </li>

//             <li className="flex justify-between">
//               <div>
//                 <span>Media</span>
//                 <div>{data?.storageBreakdown.media?.count || 0} files</div>
//                 <br />
//               </div>
//               <span>
//                 {bytesToMB(data?.storageBreakdown.media?.storage || 0)} MB
//               </span>
//             </li>
//             <li className="flex justify-between">
//               <div>
//                 <span>Documents</span>
//                 <div>{data?.storageBreakdown.document?.count || 0} files, </div>
//                 <br />
//               </div>
//               <span>
//                 {bytesToMB(data?.storageBreakdown.document?.storage || 0)} MB
//               </span>
//             </li>

//             <li className="flex justify-between">
//               <div className="flex items-center space-x-2">
//                 <Image
//                   src="/dashboard/dashboard.svg"
//                   alt="dashboard"
//                   width={20}
//                   height={20}
//                   className="transition-all duration-200"
//                 />
//                 <div className="flex flex-col">
//                   <span>Other</span>
//                   <span>{data?.storageBreakdown.other?.count || 0} files</span>
//                 </div>
//               </div>

//               <span>
//                 {bytesToMB(data?.storageBreakdown.other?.storage || 0)} MB
//               </span>
//             </li>
//           </ul>
//         </CardContent>
//       </Card>

//       <Card className="p-6 rounded-lg shadow-lg bg-white">
//         {/* Card Header */}
//         <CardHeader className="text-center mb-4">
//           <CardTitle className="text-xl font-bold">Upgrade account!</CardTitle>
//         </CardHeader>

//         <CardContent className="flex flex-col items-center space-y-4">
//           <div className="relative w-36 h-36">
//             <NextImage
//               src="/dashboard/upgrade.svg"
//               alt="Upgrade Illustration"
//               fill
//               className="object-contain"
//               sizes="100%"
//             />
//           </div>

//           <p className="text-center text-sm text-muted-foreground">
//             5 integrations, 30 team members, advanced features for teams.
//           </p>

//           <Button
//             size="lg"
//             className="w-full mt-4 bg-blue-500 text-white rounded"
//           >
//             Upgrade
//           </Button>
//         </CardContent>
//       </Card>

//     </div>
//   );
// }
