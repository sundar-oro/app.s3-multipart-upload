"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Folder,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { SideBar } from "./sidebar";
import { DashboardTable } from "./dashboardtable";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";

import { useRouter } from "next/navigation";
import { logout } from "@/redux/Modules/userlogin/userlogin.slice";
import Navbar from "./navbar";
// import StatsData from "./dummydata";
import { useEffect, useState } from "react";
import { prepareQueryParams } from "@/lib/helpers/Core/prepareQueryParams";
import { getDashCategoriesApi } from "@/lib/services/categories";
import { truncateFileName } from "../Categories/Files";
import StatsData from "./dummydata";

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information.";

interface FileData {
  id: string;
  name: string;
  mime_type: string;
  type: string;
  size: number;
  status: string;
  url: string;
}

export function Dashboard() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categorydata, setCategoryData] = useState<any[]>([]);
  const [filesData, setFilesData] = useState<FileData[]>([]);
  const [noData, setNoData] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state?.user?.user_details);

  const handleLogout = () => {
    // Dispatch the logout action
    dispatch(logout());

    // Redirect to login page
    router.push("/");
  };

  console.log(user, "daaa");

  const router = useRouter();

  const handleViewAll = () => {
    router.push("/categories");
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="h-screen w-50 sticky top-0">
        {" "}
        <SideBar />
      </div>

      <div className="flex flex-1 flex-col bg-muted/40 overflow-y-auto">
        {/* <div className="flex flex-1 flex-col bg-muted/40"> */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs"></SheetContent>
          </Sheet>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div>
          <h2 className="text-xl font-semibold mb-4">Storage Stats</h2>
          {/* Include the StatsData component */}
          <StatsData />
        </div>

        <main className="grid flex-1 items-start gap-4 ps-0 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <DashboardTable />
          </div>
        </main>
        {/* </div> */}
      </div>
    </div>
  );
}
