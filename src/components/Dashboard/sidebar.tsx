"use client";
import Image from "next/image";
import {
  Folder,
  Users,
  ChevronDown,
  FilePlus,
  FileText,
  Film,
  Grid,
  MoreHorizontal,
  File,
  Home,
  LineChart,
  ListFilter,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { postCreateCategoryAPI } from "@/lib/services/categories";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RootState } from "@/redux";
import { useSelector } from "react-redux";

export function SideBar({
  categoryid,
  getAllCategories,
  setCategoryId,
}: {
  categoryid?: number | null;
  getAllCategories?: (page: number, value: boolean) => void;
  setCategoryId?: Dispatch<SetStateAction<number>>;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
  });
  const user = useSelector((state: RootState) => state?.user?.user_details);

  const handleCard = () => {
    router.push(`/myfiles`);
  };

  const handleCreate = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createCategories = async () => {
    setLoading(true);
    try {
      const payload = { ...data };
      const response = await postCreateCategoryAPI(payload);

      if (response?.status == 200 || response?.status == 201) {
        setOpen(false);
        router.push("/categories");

        getAllCategories && getAllCategories(1, false);

        // toast.success(response?.data?.message);
        // setDeleteid(false);
      } else {
        throw response;
      }
    } catch (err: any) {
      //   errorPopper(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextFieldChange = (e: any) => {
    const { name, value } = e.target;

    // setErrMessages((prevErr: any) => ({
    //   ...prevErr,
    //   [name]: null,
    // }));

    setData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleCategories = () => {
  //   router.replace("/categories");
  // };

  return (
    <nav className="flex flex-col h-full w-40 bg-white text-gray-800 py-4 px-3 ">
      <div className="flex items-center justify-between mb-6 px-3 border-gray-300 mb-6">
        <div>
          <p className="text-xl font-semibold text-gray-900">
            {user ? user?.full_name : "Username"}
          </p>
          <p className="text-sm text-gray-500">
            {user ? user?.email : "email"}
          </p>
        </div>
        <ChevronDown className="h-5 w-5 text-gray-500" />
      </div>
      {/* <div className="mb-6 px-3">
        <h2 className="text-lg font-bold text-gray-800">Storage</h2>

        <h4 className="text-lg font-bold text-blue-500">My Files</h4>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <Folder className="h-5 w-5" />
              <span>Analytics</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <Folder className="h-5 w-5" />
              <span>Assets</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <Folder className="h-5 w-5" />
              <span>Marketing</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <Folder className="h-5 w-5" />
              <span>Templates</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <Folder className="h-5 w-5" />
              <span>Projects</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 hover:text-gray-900"
            >
              <Folder className="h-5 w-5" />
              <span>Projector Courses</span>
            </Link>
          </li>
        </ul>
      </div> */}
      <div className="mb-6 px-3">
        <ul className="space-y-2 text-gray-600">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 p-2 rounded-md hover:text-violet-500 "
            >
              <Image
                src="/dashboard/dashboard.svg"
                alt="dashboard"
                width={20}
                height={20}
                className="transition-all duration-200"
              />
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              href="/myfiles"
              className="flex items-center space-x-2 p-2 rounded-md hover:text-violet-500 "
            >
              <Image
                src="/dashboard/MyFiles.svg"
                alt="MyFiles"
                width={20}
                height={20}
                className="transition-all duration-200"
              />
              <span>MyFiles</span>
            </Link>
          </li>

          <li>
            <Link
              href="/categories"
              className="flex items-center space-x-2 p-2 rounded-md hover:text-violet-500 "
            >
              <Image
                src="/dashboard/Categories.svg"
                alt="Categories"
                width={20}
                height={20}
                className="transition-all duration-200"
              />
              <span>Categories</span>
            </Link>
          </li>

          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 p-2 rounded-md hover:text-violet-500 "
            >
              <Image
                src="/dashboard/Stared.svg"
                alt="Stared"
                width={20}
                height={20}
                className="transition-all duration-200"
              />
              <span>Starred</span>
            </Link>
          </li>

          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 p-2 rounded-md hover:text-violet-500 "
            >
              <Image
                src="/dashboard/Trash.svg"
                alt="Trash"
                width={20}
                height={20}
                className="transition-all duration-200"
              />
              <span>Trash</span>
            </Link>
          </li>

          <li>
            <Link
              href="#"
              className="flex items-center space-x-2 p-2 rounded-md hover:text-violet-500 "
            >
              <Image
                src="/dashboard/Setting.svg"
                alt="Settings"
                width={20}
                height={20}
                className="transition-all duration-200"
              />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </div>
      {/* Divider
      <hr className="border-gray-300 mb-6" /> */}
      <div className="mt-auto px-3">
        {!categoryid && (
          <Button
            onClick={handleCreate}
            className="flex items-center justify-center w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <span>Create new</span>
            <span className="ml-2">
              <FilePlus className="h-5 w-5" />
            </span>
          </Button>
        )}
        <Dialog open={open}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Create Categories</DialogTitle>
              <DialogDescription>
                You can create your new Categories Here.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Category Name
                </Label>
                <Input
                  id="name"
                  value={data?.name}
                  // defaultValue="Pedro Duarte"
                  className="col-span-3"
                  name="name"
                  placeholder="Enter the Category Name"
                  onChange={handleTextFieldChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Description
                </Label>
                <Input
                  id="username"
                  // defaultValue="@peduarte"
                  name="description"
                  value={data?.description}
                  className="col-span-3"
                  placeholder="Enter the Description"
                  onChange={handleTextFieldChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose} variant="ghost" type="submit">
                Cancel
              </Button>
              <Button onClick={createCategories} type="submit">
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
}
