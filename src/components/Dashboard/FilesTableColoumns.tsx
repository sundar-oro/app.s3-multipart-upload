import { Delete, Download, Trash2 } from "lucide-react";
import { formatSize } from "../Categories/Files";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const FilesTableColumns = () => {
  const convertToLocalDate = (utcDateString: Date) => {
    return dayjs.utc(utcDateString).local().format("DD-MM-YYYY h:mm A");
  };

  return [
    {
      accessorFn: (row: any) => row.title,
      id: "title",
      header: () => <span>Title</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
      maxWidth: "120px",
      minWidth: "120px",
      cell: (info: any) => {
        const title = info.getValue() || "--";
        const displayTitle =
          title.length > 10 ? `${title.slice(0, 10)}...` : title;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer capitalize">
                  {displayTitle}
                </span>
              </TooltipTrigger>
              <TooltipContent className="capitalize">{title}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorFn: (row: any) => row.uploaded_at,
      id: "uploaded_at",
      header: () => <span>Uploaded At</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      cell: (info: any) => {
        return (
          <span>
            {info.getValue() ? convertToLocalDate(info.getValue()) : "N/A"}
          </span>
        );
      },
    },
    {
      accessorFn: (row: any) => row.category_name,
      id: "category_name",
      header: () => <span>Category Name</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
      maxWidth: "120px",
      minWidth: "120px",
      cell: (info: any) => {
        const categoryName = info.getValue() || "---";
        const displaycategoryName =
          categoryName.length > 10
            ? `${categoryName.slice(0, 10)}...`
            : `${categoryName}`;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer capitalize">
                  {displaycategoryName}
                </span>
              </TooltipTrigger>
              <TooltipContent className="capitalize">
                {categoryName}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorFn: (row: any) => row.size,
      id: "size",
      header: () => <span>File Size</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
      maxWidth: "120px",
      minWidth: "120px",
      cell: (info: any) => {
        return <span>{formatSize(info.getValue() || 0)}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.type,
      id: "type",
      header: () => <span>File Type</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
      maxWidth: "120px",
      minWidth: "120px",
      cell: (info: any) => {
        return <span className="capitalize">{info.getValue() || "---"}</span>;
      },
    },
  ];
};
