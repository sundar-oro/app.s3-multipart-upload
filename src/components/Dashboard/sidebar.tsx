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
import NavBar from "./navbar";

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
    <div className="flex bg-white h-screen">
      {/* Sidebar */}
      <div className="w-[13%] flex-col justify-between border-r">
        <div className="text-center py-5">
          <h2 className="font-primary font-bold text-2xl text-[#7645EB]">
            Ashika Files
          </h2>
        </div>
        <ul className="flex-col gap-8 flex mt-10 py-7 px-5">
          <li className="font-primary text-[16px]">
            <Link
              href="/dashboard"
              className={`flex items-center space-x-3 p-2 rounded-md hover:bg-gray-200 font-primary text-[16px] ${
                isActive("/dashboard") ? "text-[#7645eb]" : "text-black"
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
              className={`flex items-center space-x-3 p-2 rounded-md hover:bg-gray-200 font-primary text-[16px] ${
                isActive("/myfiles") ? "text-[#7645eb]" : "text-black"
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
              className={`flex items-center space-x-3 p-2 rounded-md hover:bg-gray-200  font-primary text-[16px]${
                isActive(`/categories`) ? "text-[#7645eb]" : "text-black"
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
      </div>

      {pathname.includes("/categories") && (
        <div>
          <CategoriesSideBar />
        </div>
      )}
      {/* Main Content */}
      <div className="flex-grow  w-[90%] bg-[#f3f0f7]">
        <NavBar />
        {children}
      </div>

      {/* File Upload Dialog */}
      <Dialog open={showFileUpload}>
        <DialogContent className="bg-white w-[80%]">
          <DialogTitle>New FileUpload</DialogTitle>

          <MultiPartUploadComponent
            showFileUpload={showFileUpload}
            setShowFileUpload={setShowFileUpload}
            from="sidebar"
          />

          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default SideBar;
