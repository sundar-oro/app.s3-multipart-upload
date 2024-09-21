import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FileData } from "@/lib/interfaces/files";
import { getMyFilesAPI } from "@/lib/services/files";
import { RootState } from "@/redux";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatSize, truncateFileName } from ".";
import { convertToLocalDate } from "@/components/Dashboard/dashboardtable";
import { Table2 } from "lucide-react";

const MyListFiles = ({ filesData }: { filesData: FileData[] }) => {
  return (
    <div className="ml-40 mt-10 flex-grow flex flex-col justify-between p-6 ">
      <Card className="h-full">
        {/* <CardHeader className="px-7">
          <CardTitle>Recent Files</CardTitle>
        </CardHeader> */}
        <CardContent>
          <Table>
            <TableBody>
              {filesData ? (
                filesData?.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="font-medium">
                        {truncateFileName(file.title, 10)}
                      </div>
                      {/* <div className="text-sm text-muted-foreground">
                      {truncateFileName(file.mime_type, 10)}
                    </div> */}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {convertToLocalDate(file.uploaded_at)}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      categorie {file.category_id}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatSize(file.size)}
                    </TableCell>

                    {/* <TableCell className="text-right">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View File
                    </a>
                  </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center"></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
export default MyListFiles;
