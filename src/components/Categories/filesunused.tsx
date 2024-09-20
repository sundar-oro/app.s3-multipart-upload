"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SideBar } from "../Dashboard/sidebar";
import {
  getAllCategoriesAPI,
  deleteCategoryAPI,
  getSingleCategoryAPI,
  updateCategoryAPI,
} from "@/lib/services/categories";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EllipsisVertical, Folder } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DeleteDialog from "../Core/deleteDialog";
import Loading from "../Core/loading";
import { prepareQueryParams } from "@/lib/helpers/Core/prepareQueryParams";
import { toast } from "sonner";

export function Categories() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<boolean>(false);
  const [renameOpen, setRenameOpen] = useState<boolean>(false);
  const [deleteid, setDeleteid] = useState<number>(0);
  const [categorydata, setCategoryData] = useState<any[]>([]);
  const [data, setData] = useState("");
  const [noData, setNoData] = useState(false);
  const [errMessages, setErrMessages] = useState<any>({});

  // Fetch all categories
  const getAllCategories = async (
    page: number,
    isScrolling: boolean = false
  ) => {
    let queryParams = prepareQueryParams({
      page: page ? page : 1,
      limit: 10,
    });
    setLoading(true);
    try {
      const response = await getAllCategoriesAPI(queryParams);

      if (response?.success) {
        const newPage = page + 1;
        const newData = response?.data?.data;

        if (isScrolling) {
          setCategoryData((prevData) => prevData.concat(newData));
        } else {
          setCategoryData(newData);
        }

        setPage(newPage);
        if (newData.length === 0) setNoData(true);
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 10
    ) {
      if (!noData && !loading) {
        getAllCategories(page, true);
      }
    }
  };

  // Delete category
  const deleteCategory = async () => {
    try {
      const response = await deleteCategoryAPI(deleteid);

      if (response?.status == 200 || response?.status == 201) {
        setOpen(false);
        await getAllCategories(1, false);
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // Get single category details
  const getSingleCategory = async (id: number) => {
    setLoading(true);
    try {
      const response = await getSingleCategoryAPI(id);
      if (response?.status == 200 || response?.status == 201) {
        setData(response?.data?.name);
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update category
  const updateCategory = async () => {
    setLoading(true);
    try {
      const payload = { name: data };
      const response: any = await updateCategoryAPI(id, payload);

      if (response?.status === 200 || response?.status === 201) {
        setRenameOpen(false);
        setId(0);
        // setErrMessages(response?.errors);
        await getAllCategories(1, false);
      } else if (response.status === 422) {
        setErrMessages(response?.errors);
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCard = (categoryid: number) => {
    router.push(`/categories/${categoryid}/files`);
  };

  // Attach and remove scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, noData, loading]);

  // Fetch categories on component mount
  useEffect(() => {
    getAllCategories(1, false);
  }, []);

  return (
    <>
      <div className="flex min-h-screen w-full">
        <div className="sticky top-0 left-0 h-screen w-50 bg-white">
          <SideBar getAllCategories={getAllCategories} />
        </div>

        <div className="flex flex-1 flex-col bg-muted/40">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"></header>
          <main className="grid flex-1 gap-4 p-4">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Categories</h3>
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
                              onClick={(e) => e.stopPropagation()}
                            />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            onClick={(e) => e.stopPropagation()}
                            align="end"
                          >
                            <DropdownMenuItem
                              onClick={() => getSingleCategory(data?.id)}
                            >
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteid(data?.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{data?.name}</div>
                        <p className="text-xs text-muted-foreground">
                          {data?.files_count} files
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

      {open && (
        <DeleteDialog
          openOrNot={open}
          onCancelClick={() => setOpen(false)}
          label="Are you sure you want to delete this Category?"
          onOKClick={deleteCategory}
          deleteLoading={loading}
        />
      )}
      <Dialog open={renameOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
          </DialogHeader>
          <Input
            id="name"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Enter new category name"
          />
          {errMessages?.name && (
            <p className="text-red-500">{errMessages.name[0]}</p>
          )}
          <DialogFooter>
            <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
            <Button onClick={updateCategory}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Loading loading={loading} />
    </>
  );
}
