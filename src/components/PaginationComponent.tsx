import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import ItemsPerPageDropdown from "./ItemsPerPageDropdown";
import { Input } from "./ui/input";

interface PaginationProps {
  page: number;
  total_pages: number;
  total: number;
  onPageChange: (newPage: number) => void;
  itemsPerPage: number;
  onChangeItemsPerPage: (limit: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  page,
  total_pages,
  total,
  onPageChange,
  itemsPerPage,
  onChangeItemsPerPage,
}) => {
  const [gotoPage, setGotoPage] = useState<string>("");

  const renderPageNumbers = () => {
    const range = 2;
    let start = Math.max(1, page - range);
    let end = Math.min(total_pages, page + range);

    if (end - start < 2 * range) {
      if (start === 1) {
        end = Math.min(total_pages, start + 2 * range);
      } else if (end === total_pages) {
        start = Math.max(1, end - 2 * range);
      }
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handleGotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGotoPage(event.target.value);
  };

  const handleGotoSubmit = () => {
    const pageNumber = parseInt(gotoPage, 10);
    if (pageNumber >= 1 && pageNumber <= total_pages) {
      onPageChange(pageNumber);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleGotoSubmit();
    }
  };

  const pages = renderPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <div style={{ display: "flex", alignItems: "center" }}>
          GoTo
          <Input
            type="text"
            value={gotoPage}
            onChange={handleGotoChange}
            onKeyPress={handleKeyPress}
            style={{
              marginLeft: "10px",
              width: "60px",
              textAlign: "center",
              maxHeight: "28px",
            }}
            placeholder="Page"
          />
        </div>
      </PaginationContent>
      {/* <PaginationContent>Total {total}</PaginationContent> */}
      <PaginationContent>
        <ItemsPerPageDropdown
          itemsPerPage={itemsPerPage}
          onChangeItemsPerPage={onChangeItemsPerPage}
        />
      </PaginationContent>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              style={{ cursor: "pointer" }}
              onClick={() => onPageChange(page - 1)}
            />
          </PaginationItem>
        )}
        {pages.map((number, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              onClick={() => onPageChange(number)}
              style={{ fontWeight: page === number ? "bold" : "normal" }}
              className="rounded-md border h-7"
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page < total_pages && (
          <PaginationItem>
            <PaginationNext
              style={{ cursor: "pointer" }}
              onClick={() => onPageChange(page + 1)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
      {/* <PaginationContent>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          GoTo
         <Input
            type="text"
            value={gotoPage}
            onChange={handleGotoChange}
            onKeyPress={handleKeyPress}
            style={{ marginLeft: '10px', width: '60px', textAlign: 'center',maxHeight:'48px' }}
            placeholder="Page"
          />
        </div>
      </PaginationContent> */}
      <PaginationContent>Total {total}</PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
