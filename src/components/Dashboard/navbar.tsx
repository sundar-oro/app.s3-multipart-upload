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

const NavBar = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state?.user?.user_details);

  const handleLogout = () => {
    // Dispatch the logout action
    dispatch(logout());

    // Redirect to login page
    router.replace("/");
  };

  if (pathname == "/") {
    return children;
  }

  return (
    <div>
      <div className="flex  w-full flex-col ">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-gray-700 px-4 md:px-6">
          <Link
            href="#"
            className="text-white font-bold-200 transition-colors hover:text-foreground "
          >
            <b>Logo</b>
          </Link>
          {/* // search box */}
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white-500"
                />
              </div>
            </form>
          </div>
          {/* // dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full bg-white"
              >
                <Image
                  src="/dashboard/dashboard-avatar.svg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full bg-white"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>MyAccount</DropdownMenuLabel>
              <p>{user ? `Hello, ${user.full_name}` : "Hello, Guest"}</p>

              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
      </div>
      {children}
    </div>
  );
};

export default NavBar;
