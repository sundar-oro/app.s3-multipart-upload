"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { prepareQueryParams } from "@/lib/helpers/Core/prepareQueryParams";
import {
  deleteCategoryAPI,
  getAllCategoriesAPI,
  getSingleCategoryAPI,
  updateCategoryAPI,
} from "@/lib/services/categories";
import { Folder, Loader2, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import DeleteDialog from "../Core/deleteDialog";
import Loading from "../Core/loading";
import AddDialog from "../Core/CreateDialog";

const CategoriesSideBar = () => {
  const router = useRouter();
  const { file_id } = useParams();
  const categorySideBarRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [id, setId] = useState<number>(0);
  const [noData, setNoData] = useState(false);
  const [open, setOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState<boolean>(false);
  const [deleteid, setDeleteid] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [recentCategoryId, setRecentCategoryId] = useState(0);
  const [errMessages, setErrMessages] = useState<any>({});

  // API Calls

  const getSingleCategory = async (id: number) => {
    setLoading(true);
    try {
      const response = await getSingleCategoryAPI(id);

      if (response?.status == 200 || response?.status == 201) {
        console.log(response?.data?.data?.name);
        setName(response?.data?.data?.name);
        setId(id);
        setRenameOpen(true);
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
        name: name,
      };
      const response: any = await updateCategoryAPI(id, payload);
      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.data?.message);
        setRenameOpen(false);
        setId(0);
        setName("");
        await getAllCategories(1, false);
      } else if (response.status === 422) {
        setErrMessages(response?.data?.errors);
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

  const getAllCategories = async (
    page: number,
    isScrolling: boolean = false,
    search_val?: string
  ) => {
    let queryParams = prepareQueryParams({
      page: page || 1,
      limit: 20,
      search_string: search_val,
    });
    try {
      const response = await getAllCategoriesAPI(queryParams);
      if (response?.success) {
        const newPage = page + 1;
        const newData = response?.data?.data;

        if (isScrolling) {
          setCategoryData((prevData) => prevData.concat(newData));
        } else {
          setCategoryData(newData);
          setRecentCategoryId(newData[0]?.id);
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

  const deleteCategory = async () => {
    setLoading(true);
    try {
      const response = await deleteCategoryAPI(deleteid);

      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.data?.message);
        setOpen(false);
        await getAllCategories(1, false);
        router.replace(`/categories/${recentCategoryId}/files`);
      } else {
        throw response;
      }
    } catch (err: any) {
    } finally {
      setLoading(false);
      setSearch("");
    }
  };

  const getUniqueCategories = (categories: any[]) => {
    const seenIds = new Set<number>();
    const uniqueCategories = categories.filter((category) => {
      const categoryId = Number(category.id);
      if (seenIds.has(categoryId)) {
        return false;
      } else {
        seenIds.add(categoryId);
        return true;
      }
    });
    return uniqueCategories;
  };

  const uniqueCategories = getUniqueCategories(categoryData);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRenameClose = () => {
    setRenameOpen(false);
    setId(0);
    setName("");
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setName(value);
  };

  const handleCategoryFiles = (id: number) => {
    router.push(`/categories/${id}/files`);
  };

  const isActive = (id: string) => file_id === id;

  const handleScroll = () => {
    const categorySideBar = categorySideBarRef.current;

    if (
      categorySideBar &&
      categorySideBar.scrollTop + categorySideBar.clientHeight >=
        categorySideBar.scrollHeight - 10
    ) {
      if (!noData && !loading) {
        getAllCategories(page, true);
      }
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteid(id);
    setOpen(true);
  };

  useEffect(() => {
    const categorySideBar = categorySideBarRef.current;
    if (categorySideBar) {
      categorySideBar.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (categorySideBar) {
        categorySideBar.removeEventListener("scroll", handleScroll);
      }
    };
  }, [page, noData, loading]);

  useEffect(() => {
    getAllCategories(1, false, search);
  }, [file_id]);

  useEffect(() => {
    let debounce = setTimeout(() => {
      getAllCategories(1, false, search);
    }, 500);
    return () => clearInterval(debounce);
  }, [search]);

  return (
    <>
      <div className="flex flex-col h-screen w-60 bg-gray text-gray-800 p-4">
        <div className="mt-14 relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search categories..."
            value={search}
            type="search"
            onChange={handleSearchChange}
            className="w-full pl-8"
          />
        </div>

        <div ref={categorySideBarRef} className="flex-1 overflow-y-auto">
          {uniqueCategories.length > 0 ? (
            uniqueCategories.map((data, index) => (
              <ul key={index} className="space-y-2 text-gray-600">
                <li
                  onClick={() => handleCategoryFiles(data?.id)}
                  className={`flex items-center space-x-2 p-2 rounded-md  ${
                    isActive(`${data?.id}`)
                      ? "text-violet-500"
                      : "hover:text-violet-500"
                  }`}
                >
                  <Folder className="w-5 h-5 transition-all duration-200" />
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-pointer capitalize">
                              {data?.name.length > 15
                                ? `${data?.name.slice(0, 15)}...`
                                : data?.name}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>{data?.name}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => getSingleCategory(data?.id)}
                      >
                        Rename
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => handleDeleteClick(data?.id)}
                      >
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </li>
              </ul>
            ))
          ) : (
            <p className="text-gray-500">No categories found</p>
          )}
        </div>
      </div>

      <DeleteDialog
        openOrNot={open}
        onCancelClick={handleClose}
        label="Are you sure you want to delete this Category?"
        onOKClick={deleteCategory}
        deleteLoading={loading}
      />

      <AddDialog
        openOrNot={renameOpen}
        onCancelClick={handleRenameClose}
        title="Update Category"
        onOKClick={updateCategory}
        placeholder="Enter another Name for category"
        createLoading={loading}
        handleTextFieldChange={handleTextFieldChange}
        value={name}
        errMessage={errMessages?.name}
        buttonName="Rename"
      />
      <Loading loading={loading} />
    </>
  );
};

export default CategoriesSideBar;
