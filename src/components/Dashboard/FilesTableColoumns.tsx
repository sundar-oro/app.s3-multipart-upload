import { formatSize } from "../Categories/Files";

export const FilesTableColumns = () => {
  const convertToLocalDate = (utcDateString: string | number | Date) => {
    const date = new Date(utcDateString);
    return date.toLocaleString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      //timeZoneName: "short",
    });
  };
  return [
    {
      accessorFn: (row: any) => row.title,
      id: "title",
      header: () => <span>Title</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return <span className="capitalize">{info.getValue() || "--"}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.uploaded_at,
      id: "uploaded_at",
      header: () => <span>Uploaded At</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
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
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return <span>{info.getValue() || "---"}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.size,
      id: "size",
      header: () => <span>File Size</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return <span>{formatSize(info.getValue() || 0)}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.type,
      id: "type",
      header: () => <span>File Type</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return <span className="capitalize">{info.getValue() || "---"}</span>;
      },
    },
  ];
};
