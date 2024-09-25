import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { FC, useState } from "react";

interface pageProps {
  columns: any[];
  data: any[];
  loading: boolean;
  searchParams?: any;
  getData?: any;
}

const TanStackTable: FC<pageProps> = ({
  columns,
  data,
  loading,
  searchParams,
  getData,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  let removeSortingForColumnIds = ["serial", "id", "month_year", "actions"];

  const table = useReactTable({
    columns,
    data,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const SortItems = ({
    searchParams,
    header,
  }: {
    searchParams: any;
    header: any;
  }) => {
    if (removeSortingForColumnIds?.includes(header?.id)) {
      return <></>;
    } else {
      return (
        <div>
          {searchParams?.sort_by === header?.id ? (
            searchParams?.sort_type == "asc" ? (
              <Image
                src="/sort/sort-asc.svg"
                height={8}
                width={8}
                alt="Sort Asc"
              />
            ) : (
              <Image
                src="/sort/sort-desc.svg"
                height={8}
                width={8}
                alt="Sort Desc"
              />
            )
          ) : (
            <Image src="/sort/un-sort.svg" height={8} width={8} alt="Unsort" />
          )}
        </div>
      );
    }
  };

  const getWidth = (id: string) => {
    const widthObj = columns.find((col) => col.id === id);
    return widthObj ? widthObj?.width || "100px" : "100px";
  };

  const sortAndGetData = (header: any) => {
    if (removeSortingForColumnIds.includes(header.id)) return;

    let orderBy = header.id;
    let orderType = "asc";
    if ((searchParams?.sort_by as string) === header.id) {
      orderType = searchParams?.sort_type === "asc" ? "desc" : "";
      if (orderType === "") orderBy = "";
    }

    getData({
      ...searchParams,
      page: 1,
      orderBy,
      orderType,
    });
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="max-h-[500px] overflow-y-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200 sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => {
              if (Object.keys(searchParams)?.length > 0) {
                return (
                  <tr className="border-b" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className="p-4 text-left font-semibold text-gray-700"
                        style={{
                          minWidth: getWidth(header.id),
                          width: getWidth(header.id),
                        }}
                      >
                        {!header.isPlaceholder && (
                          <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => sortAndGetData(header)}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <SortItems
                              searchParams={searchParams}
                              header={header}
                            />
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                );
              } else {
                return (
                  <tr className="border-b" key={headerGroup.id}>
                    {headerGroup.headers.map((header: any, index: number) => {
                      return (
                        <th
                          className="p-4 text-left font-semibold text-gray-700"
                          key={index}
                          colSpan={header.colSpan}
                          style={{
                            minWidth: getWidth(header.id),
                            width: getWidth(header.id),
                            color: "#000",
                            background: "#F0EDFF",
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                              style={{
                                display: "flex",
                                gap: "10px",
                                cursor: "pointer",
                                minWidth: getWidth(header.id),
                                width: getWidth(header.id),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}

                              {{
                                asc: (
                                  <Image
                                    src="/sort/sort-asc.svg"
                                    height={8}
                                    width={8}
                                    style={{
                                      display:
                                        removeSortingForColumnIds?.includes(
                                          header.id
                                        )
                                          ? "none"
                                          : "",
                                    }}
                                    alt="image"
                                  />
                                ),
                                desc: (
                                  <Image
                                    src="/sort/sort-desc.svg"
                                    height={8}
                                    width={8}
                                    style={{
                                      display:
                                        removeSortingForColumnIds?.includes(
                                          header.id
                                        )
                                          ? "none"
                                          : "",
                                    }}
                                    alt="image"
                                  />
                                ),
                              }[header.column.getIsSorted() as string] ?? (
                                <Image
                                  src="/sort/un-sort.svg"
                                  height={8}
                                  width={8}
                                  alt="Unsorted"
                                  style={{
                                    display:
                                      header.id === "actions" ||
                                      removeSortingForColumnIds.includes(
                                        header.id
                                      )
                                        ? "none"
                                        : "",
                                  }}
                                />
                              )}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                );
              }
            })}
          </thead>
          <tbody>
            {data.length ? (
              table.getRowModel().rows.map((row) => (
                <tr className="border-b hover:bg-gray-100" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td className="p-4" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : !loading ? (
              <tr className="flex justify-center items-center w-full">
                <td colSpan={6} className="text-center py-8">
                  <Image
                    src="/No-Files.jpg"
                    alt="No Data"
                    height={150}
                    width={250}
                  />
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TanStackTable;
