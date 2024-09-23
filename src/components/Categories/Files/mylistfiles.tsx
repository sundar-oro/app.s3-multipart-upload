import { convertToLocalDate } from "@/components/Dashboard/dashboardtable";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import { formatSize, truncateFileName } from ".";

const MyListFiles = ({ filesData }: { filesData: any }) => {
  return (
    <div className="ml-6 mt-6 p-6 flex-grow overflow-auto max-h-[70vh]">
      <Card className="h-full">
        <CardContent className="relative">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-background sticky top-0 z-10">
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Uploaded At
                </TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Size</TableHead>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="max-h-[60vh] overflow-y-auto">
              {filesData && filesData.length > 0 ? (
                filesData.map((file: any) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="font-medium">
                        {truncateFileName(file.title, 10)}
                      </div>
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No files available.
                  </TableCell>
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
