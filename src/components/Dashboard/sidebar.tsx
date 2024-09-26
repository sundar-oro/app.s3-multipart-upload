"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight, File, Folder } from "lucide-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { prepareQueryParams } from "@/lib/helpers/Core/prepareQueryParams";
import {
  getAllCategoriesAPI,
  postCreateCategoryAPI,
} from "@/lib/services/categories";
import { RootState } from "@/redux";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CategoriesSideBar from "./categoriesSidebar";
import { toast } from "sonner";
import MultiPartUploadComponent from "../MultipartUpload/MultiPartUpload";
import AddDialog from "../Core/CreateDialog";

const SideBar = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const [errMessages, setErrMessages] = useState<any>();
  const [recentCategoryId, setRecentCategoryId] = useState(0);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleCreate = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setData({ name: "", description: "" });
    setErrMessages({});
  };

  const getRecentCategory = async (page: number) => {
    let queryParams = prepareQueryParams({ page: page || 1, limit: 20 });
    setLoading(true);
    try {
      const response = await getAllCategoriesAPI(queryParams);
      if (response?.success) {
        const newData = response?.data?.data;
        setRecentCategoryId(newData[0].id);
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createCategories = async () => {
    setLoading(true);
    try {
      const payload = { ...data };
      const response = await postCreateCategoryAPI(payload);
      console.log(response, "dfsfsd");
      if (response?.status == 200 || response?.status == 201) {
        setOpen(false);
        router.replace(`/categories/${response?.data.data.id}/files`);
        setData({ name: "", description: "" });
        await getRecentCategory(1);
        toast.success(response?.data?.message);
        setErrMessages({});
        // setDeleteid(false);
      } else if (response?.status === 422 || response?.status === 409) {
        setErrMessages(response?.data?.errors);
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

    setErrMessages((prevErr: any) => ({
      ...prevErr,
      [name]: null,
    }));

    setData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySidebar = async () => {
    await getRecentCategory(1);
    router.push(`/categories/${recentCategoryId}/files`);
    setCategoryOpen(true);
  };

  const isActive = (href: string) => pathname.includes(href);

  //getall files

  useEffect(() => {
    getRecentCategory(1);
  }, []);

  return (
    <>
      <div className="flex ">
        <nav className="flex flex-col h-full sticky w-  top-0 left-0 bg-white text-gray-800 py-4 px-3 gap-9">
          <div className="mt-[40%]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Button className="flex items-center justify-center  cursor-pointer w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  <span>+ New</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 cursor-pointer">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleCreate}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    <span>New Category</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setShowFileUpload(true)}
                  >
                    <File className="mr-2 h-4 w-4" />
                    <span>File Upload</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ul className="space-y-4 text-gray-600">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center  space-x-3 p-2 rounded-md ${
                  isActive("/dashboard") ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <Image
                  src="/dashboard/dashboard.svg"
                  alt="dashboard"
                  width={20}
                  height={20}
                />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                href="/myfiles"
                className={`flex items-center space-x-3 p-2 rounded-md ${
                  isActive("/myfiles") ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <Image
                  src="/dashboard/MyFiles.svg"
                  alt="My Files"
                  width={20}
                  height={20}
                />
                <span>My Files</span>
              </Link>
            </li>
            <li>
              <a
                onClick={handleCategorySidebar}
                className={`flex items-center space-x-3 p-2 rounded-md ${
                  isActive(`/categories`) ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <Image
                  src="/dashboard/Categories.svg"
                  alt="Categories"
                  width={20}
                  height={20}
                />
                <div className="flex justify-between items-center cursor-pointer">
                  <span>Categories</span>
                  {pathname.includes("/categories") ? <ChevronRight /> : ""}
                </div>
              </a>
            </li>
          </ul>

          <AddDialog
            openOrNot={open}
            onCancelClick={handleClose}
            title="New Category"
            onOKClick={createCategories}
            placeholder="Enter the Category Name"
            createLoading={loading}
            handleTextFieldChange={handleTextFieldChange}
            value={data?.name}
            errMessage={errMessages?.name}
            buttonName="Create"
          />
        </nav>
        {pathname.includes("/categories") && (
          <div className="w-60 ">
            <CategoriesSideBar />
          </div>
        )}
        <div className="flex-grow">{children}</div>
      </div>
      <Dialog open={showFileUpload}>
        <DialogContent className="bg-white w-[80%]">
          <DialogTitle>New FileUpload</DialogTitle>

          <MultiPartUploadComponent
            showFileUpload={showFileUpload}
            setShowFileUpload={setShowFileUpload}
            from="sidebar"
          />
          {/* <FileUpload
            showFileUpload={showFileUpload}
            setShowFileUpload={setShowFileUpload}
            from="sidebar"
          /> */}

          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default SideBar;
