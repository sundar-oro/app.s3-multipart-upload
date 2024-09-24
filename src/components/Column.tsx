import { ColumnDef } from "@tanstack/react-table";
//import { convertToLocalDate } from "./Dashboard/dashboardtable";
//import { Categories } from "./Categories";
import { formatSize } from "./Categories/Files";
import { convertToLocalDate } from "./Dashboard/dashboardtable";

export const columns: ColumnDef<any>[] = [
  {
    id: "title",
    header: "Title",
    accessorKey: "title",
    cell: (info) => {
      const value = info.getValue() as string; // Cast the value to a string
      return value
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() // Capitalize first letter and lowercase the rest
        : "";
    },
  },
  {
    id: "uploaded_at",
    accessorKey: "uploaded_at",
    header: "UploadedDate",
    cell: ({ getValue }) => convertToLocalDate(getValue<string>()),
    //enableSorting: true,
  },

  {
    id: "category_id",
    accessorKey: "category_id",
    header: "categories",
    cell: ({ getValue }) => {
      const value = getValue<string>(); // Get the value of the column
      return `category ${value} `; // Append "categorie" to the value
    },
    //enableSorting: true,
  },

  {
    id: "type",
    accessorKey: "type",
    header: "Type",
    cell: (info) => {
      const value = info.getValue() as string; // Cast the value to a string
      return value
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() // Capitalize first letter and lowercase the rest
        : "";
    },
    //enableSorting: true,
  },
  {
    id: "size",
    accessorKey: "size",
    header: "Size",
    cell: ({ getValue }) => formatSize(getValue<number>()),
    //enableSorting: true,
  },
];
