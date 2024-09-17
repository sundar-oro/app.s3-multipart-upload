"use client";
import Image from "next/image";
import {
  EllipsisVertical,
  Folder,
  Menu,
  MenuIcon,
  PanelLeft,
  Search,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SideBar } from "../Dashboard/sidebar";
import { useEffect, useState } from "react";
import {
  deleteCategoryAPI,
  getAllCategoriesAPI,
  getSingleCategoryAPI,
  updateCategoryAPI,
} from "@/lib/services/categories";
import DeleteDialog from "../Core/deleteDialog";
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
import { createcategory } from "@/lib/interfaces";
import { useRouter } from "next/navigation";
import { prepareQueryParams } from "@/lib/helpers/Core/prepareQueryParams";
import Loading from "../Core/loading";

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information.";

export function Categories() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<number>(0);
  // const [categoryid, setCategoryid] = useState(0);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<boolean>(false);
  const [renameOpen, setRenameOpen] = useState<boolean>(false);
  const [deleteid, setDeleteid] = useState<number>(0);
  const [categorydata, setCategoryData] = useState<any[]>([]);
  const [data, setData] = useState("");
  const [noData, setNoData] = useState(false);

  window.onscroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      if (!noData) {
        getAllCategories(page, true);
      }
    }
  };

  const getAllCategories = async (
    page: number,
    isScrolling: boolean = false
  ) => {
    let queryParams = prepareQueryParams({
      page: page ? page : 1,
      limit: 10,
    });
    // setCategoryData([]);
    setLoading(true);
    try {
      const response = await getAllCategoriesAPI(queryParams);

      if (response?.success) {
        // console.log(response?.data?.data);
        const newPage = page + 1;
        const newData = response?.data?.data;

        if (isScrolling) {
          // Concatenate only when fetching more data on scroll
          setCategoryData((prevData) => prevData.concat(newData));
        } else {
          // Replace data when not scrolling
          setCategoryData(newData);
        }

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

  const deleteCategory = async () => {
    // setLoading(true);
    try {
      const response = await deleteCategoryAPI(deleteid);

      if (response?.status == 200 || response?.status == 201) {
        // toast.success(response?.data?.message);
        setOpen(false);
        await getAllCategories(1, false);
      } else {
        throw response;
      }
    } catch (err: any) {
      // errorPopper(err);
    } finally {
      // setLoading(false);
    }
  };

  const getSingleCategory = async (id: number) => {
    setLoading(true);
    try {
      const response = await getSingleCategoryAPI(id);

      if (response?.status == 200 || response?.status == 201) {
        // toast.success(response?.data?.message);
        setData(response?.data?.name);
      } else {
        throw response;
      }
    } catch (err: any) {
      // errorPopper(err);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async () => {
    setLoading(true);
    try {
      const payload = {
        name: data,
      };
      const response = await updateCategoryAPI(id, payload);

      if (response?.status == 200 || response?.status == 201) {
        // toast.success(response?.data?.message);
        setRenameOpen(false);
        setId(0);
        await getAllCategories(1, false);
      } else {
        throw response;
      }
    } catch (err: any) {
      // errorPopper(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenu = (id: number) => {
    setId(id);
    getSingleCategory(id);
    setRenameOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteid(id);
    setOpen(true);
  };

  const handleClose = () => {
    if (id) {
      setRenameOpen(false);
      setId(0);
    } else {
      setOpen(false);
    }
  };

  const handleTextFieldChange = (e: any) => {
    const { name, value } = e.target;
    setData(value);
  };

  const handleCard = (categoryid: number) => {
    router.push(`/categories/${categoryid}/files`);
  };

  useEffect(() => {
    getAllCategories(page, false);
  }, []);

  return (
    <>
      <div className="flex min-h-screen w-full">
        <div className="sticky top-0 left-0 h-screen w-50 bg-white">
          <SideBar getAllCategories={getAllCategories} />
        </div>

        <div className="flex flex-1 flex-col bg-muted/40">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
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
                <BreadcrumbItem>
                  <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          {/* Main Content Area */}
          <main className="grid flex-1 gap-4 p-4">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Folders</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categorydata?.map((data, index) => (
                    <Card
                      key={index}
                      onClick={() => handleCard(data?.id)}
                      className="w-60"
                    >
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <Folder className="h-6 w-6 font-medium font-bold" />

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <EllipsisVertical
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenu(data?.id);
                              }}
                            />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenu(data?.id);
                              }}
                            >
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(data?.id);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{data?.name}</div>
                        <p className="text-xs text-muted-foreground">
                          {data?.id} files
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {open ? (
        <DeleteDialog
          openOrNot={open}
          onCancelClick={handleClose}
          label="Are you sure you want to delete this Category?"
          onOKClick={deleteCategory}
          deleteLoading={loading}
        />
      ) : (
        ""
      )}
      <Dialog open={renameOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Rename
              </Label>
              <Input
                id="name"
                name="name"
                value={data}
                className="col-span-3"
                placeholder="Enter another Name for category"
                onChange={handleTextFieldChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleClose} variant="ghost" type="submit">
              Cancel
            </Button>
            <Button onClick={updateCategory} type="submit">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Loading loading={loading} />
    </>
  );
}
