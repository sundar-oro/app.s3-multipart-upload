"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";

interface PaginationProps {
  paginationDetails: any;
  capturePageNum: (value: string) => void;
  captureRowPerItems: (value: number) => void;
  limitOptionsFromProps?: { title: string; value: number }[] | any;
  limitValue?: number;
}

const PaginationComponent = ({
  paginationDetails,
  capturePageNum,
  captureRowPerItems,
  limitOptionsFromProps,
  limitValue,
}: any) => {
  const [pageValue, setPageValue] = useState<number>(
    paginationDetails?.page || 1
  );
  const [limitOptions, setLimitOptions] = useState<
    {
      title: string;
      value: number;
    }[]
  >([]);

  const selectedValue = +paginationDetails?.limit || limitValue || 25;

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
    setPageValue(page);
    capturePageNum(page);
  };

  const handleRowChange = (newLimit: string) => {
    captureRowPerItems(Number(newLimit));
  };

  const onKeyDownInPageChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const page = Math.max(
        1,
        Math.min(Number(pageValue) || 1, paginationDetails?.total_pages)
      );
      handlePageChange(page);
    }
  };

  useEffect(() => {
    if (!paginationDetails?.total_pages) {
      const pagesCount = Math.ceil(
        paginationDetails?.count / paginationDetails?.limit
      );
    }
  }, [paginationDetails]);

  return (
    <Card>
      <Pagination className="flex flex-row items-center justify-between p-2">
        <PaginationContent>
          Total {paginationDetails?.total || paginationDetails?.count || "0"}
        </PaginationContent>

        <PaginationContent>
          <Select
            value={selectedValue.toString()}
            onValueChange={handleRowChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              {limitOptions.map((item, index) => (
                <SelectItem value={item.value.toString()} key={index}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PaginationContent>

        <PaginationContent>
          {pageValue > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(pageValue - 1)}
              />
            </PaginationItem>
          )}
          {pageValue > 2 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
          )}

          {pageValue > 2 && <PaginationEllipsis />}
          {pageValue > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(pageValue - 1)}>
                {pageValue - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink isActive>{pageValue}</PaginationLink>
          </PaginationItem>

          {pageValue < +paginationDetails?.total_pages && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(pageValue + 1)}>
                {pageValue + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          {pageValue < +paginationDetails?.total_pages - 1 && (
            <PaginationEllipsis />
          )}
          {pageValue < +paginationDetails?.total_pages && (
            <PaginationItem>
              <PaginationLink
                onClick={() =>
                  handlePageChange(+paginationDetails?.total_pages)
                }
              >
                {+paginationDetails?.total_pages}
              </PaginationLink>
            </PaginationItem>
          )}
          {pageValue < +paginationDetails?.total_pages && (
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(pageValue + 1)} />
            </PaginationItem>
          )}
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
    </Card>
  );
};

export default PaginationComponent;
