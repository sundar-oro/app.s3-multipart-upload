import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Folder,
  Home,
  LineChart,
  ListFilter,
  LucideHardDrive,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAllFilesAPI } from "@/lib/services/files";
import { truncateFileName } from "../Categories/Files";
// import { StorageStats } from "./storagestats";

interface FileData {
  uploaded_at: number;
  category_id: number;
  id: string;
  name: string;
  mime_type: string;
  type: string;
  size: number;
  status: string;
  url: string;
}

export function DashboardTable() {
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
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      // 1 MB or more
      return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
    }
  };

  const getAllFiles = async (page: number) => {
    try {
      setLoading(true);
      const response = await getAllFilesAPI(page, file_id);

      if (response?.success) {
        const newPage = page + 1;
        const newFileData = response.data;
        // const updatedFilesData = [...filesData, ...newFileData];
        //  setFilesData((prevFilesData) => [...prevFilesData, ...newFileData]);
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
    getAllFiles(page);
  }, []);

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Recent Files</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {filesData.length > 0 ? (
              filesData.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="font-medium">
                      {truncateFileName(file.name, 10)}
                    </div>
                    {/* <div className="text-sm text-muted-foreground">
                      {truncateFileName(file.mime_type, 10)}
                    </div> */}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {file.uploaded_at}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    folder {file.category_id}
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
                <TableCell colSpan={5} className="text-center">
                  {loading ? "Loading..." : "No files available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
