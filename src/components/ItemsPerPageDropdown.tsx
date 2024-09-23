"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

interface ItemsPerPageDropdownProps {
  itemsPerPage: number;
  onChangeItemsPerPage: (limit: number) => void;
}

const ItemsPerPageDropdown: React.FC<ItemsPerPageDropdownProps> = ({
  itemsPerPage,
  onChangeItemsPerPage,
}) => {
  // props
  const options = [10, 25, 50, 100];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* {itemsPerPage} Limit */}
        <Button className="h-7" variant="outline">
          {" "}
          {itemsPerPage}Limit
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onChangeItemsPerPage(option)}
            style={{ cursor: "pointer" }}
          >
            {option} per page
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ItemsPerPageDropdown;
