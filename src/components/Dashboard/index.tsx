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
import { StorageStats } from "./storagestats";
import { SideBar } from "./sidebar";
import { DashboardTable } from "./dashboardtable";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { statsData } from "./dummydata";
import { useRouter } from "next/navigation";

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information.";

export function Dashboard() {
  const user = useSelector((state: RootState) => state.user.user_details);
  console.log(user);

  const router = useRouter();

  const handleViewAll = () => {
    router.push("/categories");
  };
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-shrink-0 w-50">
        {" "}
        <SideBar />
      </div>

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

          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="/dashboard/dashboard-avatar.svg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
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
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {statsData.map((data, index) => (
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
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Folders</h3>
                <button
                  onClick={handleViewAll}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-row space-x-4 overflow-x-auto">
                <Card className="flex-shrink-0 w-60">
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
                </Card>

                <Card className="flex-shrink-0 w-40">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Folder className="h-6 w-6 font-medium font-bold" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Marketing</div>
                    <p className="text-xs text-muted-foreground">143 files</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <DashboardTable />
          </div>

          <div>
            <StorageStats />
          </div>
        </main>
      </div>
    </div>
  );
}
