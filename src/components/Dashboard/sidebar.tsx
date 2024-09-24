"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronRight, File, Folder, Loader2 } from "lucide-react";
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
import FileUpload from "../Categories/Files/filesupload";

const SideBar = ({
  categoryid,
  getAllCategories,
  setCategoryId,
  children,
}: {
  categoryid?: number | null;
  getAllCategories?: (page: number, value: boolean) => void;
  setCategoryId?: Dispatch<SetStateAction<number>>;
  children?: React.ReactNode;
}) => {
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
  const user = useSelector((state: RootState) => state?.user?.user_details);
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

    // setErrMessages((prevErr: any) => ({
    //   ...prevErr,
    //   [name]: null,
    // }));

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
      <div className="flex">
        <nav className="flex flex-col h-full  bg-white text-gray-800 py-4 px-3 gap-9">
          <div className="mt-[40%]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center justify-center w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  <span>+ New</span>
                </Button>
                {/* <Button variant="outline">Open</Button> */}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleCreate}>
                    <Folder className="mr-2 h-4 w-4" />
                    <span>New Category</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <File className="mr-2 h-4 w-4" />
                    <span onClick={() => setShowFileUpload(true)}>
                      File Upload
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ul className="space-y-4 text-gray-600">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center space-x-3 p-2 rounded-md ${
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
                <div className="flex justify-between items-center">
                  <span>Categories</span>
                  {categoryOpen ? <ChevronRight /> : ""}
                </div>
              </a>
            </li>

            {/* <li>
          onClick={handleCategorySidebar}
            className={`flex items-center space-x-3 p-2 rounded-md ${
              isActive(`/categories`) ? "bg-gray-200" : "hover:bg-gray-200"
            }`}
          <Link
            href="/settings"
            className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded-md"
          >
            <Image
              src="/icons/settings.svg"
              alt="Settings"
              width={20}
              height={20}
            />
            <span>Settings</span>
          </Link>
        </li> */}
            {/* <li>
            <div className="mt-auto text-gray-500 text-xs px-3">
              <div className="flex items-center">
                {" "}
                <Cloud />
                <span className="ml-2 text-sm"> Storage (87% full)</span>
              </div>

              <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: "87%" }}
                ></div>
                <span className="mt-3"> 13 GB used</span>
              </div>
            </div>
          </li> */}
          </ul>
          {/* <CategoriesSideBar /> */}

          <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent
              className="bg-white"
              onClick={() => console.log("close")}
            >
              <DialogHeader>
                <DialogTitle>New Category</DialogTitle>
              </DialogHeader>
              <div>
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
              {errMessages ? (
                <span className="text-red-500">{errMessages?.name}</span>
              ) : (
                ""
              )}
              <DialogFooter>
                <Button
                  onClick={handleClose}
                  // className="bg-grey-700"
                  // variant="outline"
                  variant="secondary"
                  type="submit"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createCategories}
                  type="submit"
                  disabled={loading ? true : false}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </nav>
        {pathname.includes("/categories") && (
          <div className="w-60 ">
            <CategoriesSideBar />
          </div>
        )}
        <div className="flex-grow">{children}</div>
      </div>
      <Dialog
        open={showFileUpload}
        onOpenChange={() => setShowFileUpload(false)}
      >
        <DialogContent className="bg-white w-[80%]">
          <DialogTitle>New FileUpload</DialogTitle>

          <FileUpload
            showFileUpload={showFileUpload}
            setShowFileUpload={setShowFileUpload}
          />

          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default SideBar;
