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
import StatsData from "./dummydata";
import { useEffect, useState } from "react";
import { prepareQueryParams } from "@/lib/helpers/Core/prepareQueryParams";
import { getDashCategoriesApi } from "@/lib/services/categories";
import { truncateFileName } from "../Categories/Files";

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information.";

export function Dashboard() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categorydata, setCategoryData] = useState<any[]>([]);
  const [noData, setNoData] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state?.user?.user_details);

  const getAllCategories = async (page: number) => {
    let queryParams = prepareQueryParams({
      page: page ? page : 1,
      limit: 3,
    });
    // setCategoryData([]);
    try {
      setLoading(true);
      const response = await getDashCategoriesApi(queryParams);

      if (response?.success) {
        // console.log(response?.data?.data);
        const newPage = page + 1;
        const newData = response?.data?.data;

        setCategoryData(newData);

        // if (isScrolling) {
        //   // Concatenate only when fetching more data on scroll
        //   setCategoryData((prevData) => prevData.concat(newData));
        // } else {
        //   // Replace data when not scrolling
        //   setCategoryData(newData);
        // }

        setPage(newPage);
        if (newData.length === 0) setNoData(true);
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error(err);
      //   toast.error("Failed to load  details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories(page);
  }, []);

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
      <div className="sticky flex-shrink-0 w-50">
        {" "}
        <SideBar />
      </div>
      {/* <div>
        <Navbar />
      </div> */}

      <div className="flex flex-1 flex-col bg-muted/40">
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

        <main className="grid flex-1 items-start gap-4 ps-0 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* {statsData.map((data, index) => (
                <Card key={index} className="w-full">
                  {" "}
                  <CardHeader className="flex items-center space-x-4 pb-2">
                    {" "}
                    <Image
                      src={data?.path}
                      width={36}
                      height={36}
                      alt="drive"
                      className="overflow-hidden rounded-full"
                    />
                    <CardTitle className="text-4xl">{data?.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      {data?.total}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Progress value={25} aria-label="25%" />
                  </CardFooter>
                </Card>
              ))} */}
            </div>

            {/* folders */}

            <div>
              {/* <div className="flex items-center justify-between mb-4"> */}
              <h3 className="text-xl font-semibold">Folders</h3>

              <div className="flex flex-row flex-wrap gap-5 mt-4">
                {categorydata?.map((data, index) => (
                  <Card
                    key={index}
                    // onClick={() => handleCard(data?.id)}
                    className="h-10 w-60 p-2"
                  >
                    <CardContent>
                      {truncateFileName(data?.name, 10)}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <button
                onClick={handleViewAll}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View All
              </button>
              {/* </div> */}

              <div className="flex flex-row space-x-4 overflow-x-auto">
                {/* <Card className="flex-shrink-0 w-60">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Folder className="h-6 w-6 font-medium font-bold" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Analytics</div>
                    <p className="text-xs text-muted-foreground">15 files</p>
                  </CardContent>
                </Card>
                <Card className="flex-shrink-0 w-60">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Folder className="h-6 w-6 font-medium font-bold" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Assets</div>
                    <p className="text-xs text-muted-foreground">345 files</p>
                  </CardContent>
                </Card> */}

                {/* <Card className="flex-shrink-0 w-40">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Folder className="h-6 w-6 font-medium font-bold" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Marketing</div>
                    <p className="text-xs text-muted-foreground">143 files</p>
                  </CardContent>
                </Card> */}
              </div>
            </div>

            <DashboardTable />
          </div>

          <div>
            <StatsData />
          </div>
        </main>
      </div>
    </div>
  );
}
