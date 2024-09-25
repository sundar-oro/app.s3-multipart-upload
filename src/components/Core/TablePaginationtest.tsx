"use client";

import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DynamicPaginationProps {
  paginationDetails: any;
  totalPages: number;
  totalItems?: number;
  capturePageNum: (value: number) => void;
  captureRowPerItems: (value: number) => void;
  initialPage?: number;
  limitOptionsFromProps?: { title: string; value: number }[];
}

export default function DynamicPagination({
  totalPages,
  totalItems,
  capturePageNum,
  captureRowPerItems,
  initialPage = 1,
  limitOptionsFromProps,
  paginationDetails,
}: DynamicPaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageValue, setPageValue] = useState<number>(initialPage);
  const [limitOptions, setLimitOptions] = useState<
    { title: string; value: number }[]
  >([]);

  const selectedValue = paginationDetails?.limit;

  useEffect(() => {
    setLimitOptions(
      limitOptionsFromProps?.length
        ? limitOptionsFromProps
        : [
            { title: "10/page", value: 10 },
            { title: "20/page", value: 20 },
            { title: "30/page", value: 30 },
            { title: "50/page", value: 50 },
            { title: "70/page", value: 70 },
            { title: "100/page", value: 100 },
          ]
    );
  }, [limitOptionsFromProps]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageValue(page);
      capturePageNum(page);
    }
  };

  const handleRowChange = (newLimit: string) => {
    captureRowPerItems(Number(newLimit));
  };

  const onKeyDownInPageChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const page = Math.max(1, Math.min(Number(pageValue) || 1, totalPages));
      handlePageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(null); // For ellipsis
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push(null); // For ellipsis
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push(null); // For ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(null); // For ellipsis
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <Pagination>
      <PaginationContent>
        Total {paginationDetails.total || "0"}
      </PaginationContent>

      <PaginationContent>
        <Select
          value={selectedValue?.toString()}
          onValueChange={handleRowChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            {limitOptions.map((item, index) => (
              <SelectItem value={item?.value?.toString()} key={index}>
                {item?.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PaginationContent>

      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {getPageNumbers().map((pageNumber, index) =>
          pageNumber === null ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                isActive={pageNumber === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pageNumber);
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>

      <PaginationContent>
        <div style={{ display: "flex", alignItems: "center" }}>
          GoTo
          <Input
            type="number"
            value={pageValue}
            onChange={(e) => setPageValue(Number(e.target.value))}
            onKeyDown={onKeyDownInPageChange}
            style={{
              marginLeft: "10px",
              width: "60px",
              textAlign: "center",
              fontSize: "14px",
            }}
            placeholder="Page"
          />
        </div>
      </PaginationContent>
    </Pagination>
  );
}
