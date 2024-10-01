"use client";

import React from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { logout } from "@/redux/userSlice";
// import router from "next/router";
import Link from "next/link";
import { RootState } from "@/redux";
import { logout } from "@/redux/Modules/userlogin/userlogin.slice";
import { usePathname, useRouter } from "next/navigation";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state?.user?.user_details);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/");
  };

  return (
    <div className="flex  w-full flex-col ">
      <header className=" bg-white shadow-md z-50 w-full px-5 py-2 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full bg-black"
            >
              <Image
                src="/dashboard/dashboard-avatar.svg"
                width={36}
                height={36}
                alt="Avatar"
                className="overflow-hidden rounded-full bg-black"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user ? `Hello, ${user.full_name}` : "Hello, Guest"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </div>
  );
};

export default NavBar;
