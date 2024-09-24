import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
export const TablePaginationComponent = ({
  capturePageNum,
  captureRowPerItems,
  paginationDetails,
  limitOptionsFromProps,
  limitValue,
}: {
  capturePageNum: (e: any) => void;
  captureRowPerItems: (e: any) => void;
  paginationDetails: any;
  limitOptionsFromProps?: { title: string; value: number }[] | any;
  limitValue?: number;
}) => {
  const params = useSearchParams();
  const [pageValue, setPageValue] = useState<number>(+paginationDetails?.page);
  const [totalPages, setTotalPages] = useState(0);
  const [limitOptions, setLimitOptions] = useState<any[]>([]);
  const handlePageRowChange = (value: string) => {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue)) {
      captureRowPerItems(numberValue);
    }
  };
  const onKeyDownChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newPageValue = Math.max(1, Math.min(totalPages || 1, pageValue));
      capturePageNum(newPageValue);
    }
  };
  useEffect(() => {
    setPageValue(paginationDetails?.page || 1);
    setTotalPages(+paginationDetails?.total_pages || 0);
  }, [paginationDetails]);
  useEffect(() => {
    setLimitOptions(
      limitOptionsFromProps?.length
        ? limitOptionsFromProps
        : [
            { title: "10/page", value: 10 },
            { title: "20/page", value: 20 },
            { title: "50/page", value: 50 },
            { title: "80/page", value: 80 },
            { title: "100/page", value: 100 },
          ]
    );
  }, [limitOptionsFromProps]);
  return (
    <Card className="flex justify-center items-center p-2 sticky bottom-0 left-0 w-full">
      <p className="text-sm font-normal mr-4 text-gray-600 w-[15%]">
        Total {paginationDetails?.total || paginationDetails?.count || ""}
      </p>
      <Select
        onValueChange={handlePageRowChange}
        value={paginationDetails?.limit}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Limit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {limitOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (paginationDetails.page > 1) {
                  capturePageNum(paginationDetails.page - 1);
                }
              }}
            />
          </PaginationItem>

          {/* Render page links conditionally */}
          {Array.from({ length: paginationDetails.total_pages }, (_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber < 3 ||
              pageNumber > paginationDetails.total_pages - 2 ||
              (pageNumber >= paginationDetails.page - 1 &&
                pageNumber <= paginationDetails.page + 1)
            ) {
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === paginationDetails.page}
                    onClick={(e) => {
                      e.preventDefault();
                      capturePageNum(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            return null; // Skip rendering for unneeded pages
          })}

          {/* Render ellipsis if needed */}
          {paginationDetails.total_pages > 5 && paginationDetails.page > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (paginationDetails.page < paginationDetails.total_pages) {
                  capturePageNum(paginationDetails.page + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="flex items-center gap-2 w-[15%]">
        <p className="text-sm font-medium text-gray-600">Go to</p>
        <Input
          type="number"
          value={pageValue}
          onChange={(e) => setPageValue(Number(e.target.value))}
          onKeyDown={onKeyDownChange}
          onWheel={(e) => e.currentTarget.blur()}
          className="w-16 text-center text-sm"
          min={1}
        />
      </div>
    </Card>
  );
};
