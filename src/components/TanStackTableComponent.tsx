import { prepareURLEncodedParams } from "@/lib/helpers/prepareUrlEncodedParams";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FunctionComponent, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
//import { tanstackTablePropTypes } from "@/interface/tanstackTablePropTypes";
//import { LoadingComponent } from "../LoadingComponent";
//import TablePagination from "./TablePagination";

const TanStackTableComponent: FunctionComponent<any> = ({
  columns,
  data,
  loading,
  getData,
  paginationDetails,
  removeSortingForColumnIds,
  isPaginatedData = true,
  // setSelectedIds,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const [rowSelection, setRowSelection] = useState<any>([]);
  const [navigationLoading, setNavigationLoading] = useState(false);

  // useEffect(() => {
  //   if (setSelectedIds) {
  //     let extractedIds = table
  //       .getSelectedRowModel()
  //       ?.flatRows?.map((item: any) => item.original);
  //     if (extractedIds?.length) setSelectedIds(extractedIds);
  //     else setSelectedIds([]);
  //   }
  // }, [rowSelection]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,

    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  const getWidth = (id: string) => {
    const widthObj = columns.find((item: any) => item.id == id);
    const width = widthObj?.width;
    return width;
  };

  // const capturePageNum = (value: number) => {
  //   getData({
  //     limit: params.get("limit") as string,
  //     page: value,
  //   });
  // };

  // const captureRowPerItems = (value: number) => {
  //   getData({
  //     limit: value,
  //     page: 1,
  //   });
  // };

  const sortAndGetData = (header: any) => {
    if (
      removeSortingForColumnIds &&
      removeSortingForColumnIds?.length &&
      removeSortingForColumnIds.includes(header.id)
    ) {
      return;
    }

    let orderBy = header.id;
    let orderType = "asc";
    if (params.get("sort_by") == header.id) {
      if (params.get("sort_type") == "asc") {
        orderType = "desc";
      } else {
        orderBy = "";
        orderType = "";
      }
    }
    getData({
      sort_by: orderBy,
      sort_type: orderType,
    });
  };

  const getHasSortOrNot = (id: string) => {
    return !(
      removeSortingForColumnIds?.length &&
      removeSortingForColumnIds.includes(id)
    );
  };

  const onRowClick = (dataObj: any) => {
    if (pathname == "/mtp") {
      setNavigationLoading(true);
      const { month, salesRepId } = dataObj;

      const queryObj = {
        month: month,
        salesRepId: salesRepId,
      };
      const urlString = prepareURLEncodedParams("/mtp/view", queryObj);
      router.push(urlString);
    }
  };

  return (
    <div className="defaultTable">
      <div>
        <Table>
          <TableHeader>
            {table
              .getHeaderGroups()
              .map((headerGroup: any, mainIndex: number) => (
                <TableRow className="table-row" key={mainIndex}>
                  {headerGroup.headers.map((header: any, index: number) => {
                    return (
                      <TableHead key={index}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={`cell ${
                              getHasSortOrNot(header.id) ? "sortHeader" : ""
                            }`}
                            style={{
                              display: "flex",
                              gap: "4px",
                              cursor: "pointer",
                              alignItems: "center",
                            }}
                            onClick={() => sortAndGetData(header)}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                            <SortItems
                              header={header}
                              removeSortingForColumnIds={
                                removeSortingForColumnIds
                              }
                            />
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
          </TableHeader>
          <TableBody className="tbody">
            {data?.length ? (
              table
                .getFilteredRowModel()
                .rows.map((row: any, mainIndex: number) => {
                  return (
                    <TableRow
                      style={{
                        cursor: pathname == "/mtp" ? "pointer" : "default",
                      }}
                      className="table-row"
                      key={mainIndex}
                      onClick={() => onRowClick(row?.original)}
                    >
                      {row.getVisibleCells().map((cell: any, index: number) => {
                        return (
                          <TableCell
                            className="cell"
                            key={index}
                            style={{
                              verticalAlign: "top",
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
            ) : !loading ? (
              <TableRow>
                <TableCell colSpan={columns?.length}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50vh",
                    }}
                  >
                    <Image
                      alt="no-data"
                      src={"/core/table/no-data.svg"}
                      width={250}
                      height={250}
                    />

                    <p style={{ fontSize: "clamp(20px, 1.04vw, 22px)" }}>
                      No Data
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              ""
            )}
            {loading ? (
              <TableRow>
                <TableCell colSpan={10}>
                  {/* <LoadingComponent loading={loading} label={label} /> */}
                </TableCell>
              </TableRow>
            ) : (
              ""
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TanStackTableComponent;

const sortFunction = (array: any[], keyName: string) => {
  return array.sort((a, b) => {
    const valueA = a[keyName];
    const valueB = b[keyName];

    if (valueA === null || valueA === undefined) return 1;
    if (valueB === null || valueB === undefined) return -1;

    if (typeof valueA === "number" && typeof valueB === "number") {
      return valueA - valueB;
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      return valueA.localeCompare(valueB);
    }
    return 0;
  });
};

const SortItems = ({
  header,
  removeSortingForColumnIds,
}: {
  header: any;
  removeSortingForColumnIds?: string[];
}) => {
  const params = useSearchParams();
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {params.get("sort_by") == header.id ? (
        params.get("sort_type") == "asc" ? (
          <Image
            src="/core/table/sort-asc.svg"
            height={25}
            width={25}
            alt="image"
          />
        ) : (
          <Image
            src="/core/table/sort-desc.svg"
            height={25}
            width={25}
            alt="image"
          />
        )
      ) : removeSortingForColumnIds?.includes(header.id) ? (
        ""
      ) : (
        <Image
          src="/core/table/un-sort.svg"
          height={25}
          width={25}
          alt="image"
        />
      )}
    </div>
  );
};
