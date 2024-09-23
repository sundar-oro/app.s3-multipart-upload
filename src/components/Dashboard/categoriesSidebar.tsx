"use client";
import { Input } from "@/components/ui/input";
import { prepareQueryParams } from "@/lib/helpers/Core/prepareQueryParams";
import { prepareURLEncodedParams } from "@/lib/helpers/prepareUrlEncodedParams";
import {
  getAllCategoriesAPI,
  postCreateCategoryAPI,
} from "@/lib/services/categories";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const CategoriesSideBar = ({
  categoryid,
  setCategoryId,
}: {
  categoryid?: number | null;
  setCategoryId?: Dispatch<SetStateAction<number>>;
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const categorySideBarRef = useRef<HTMLDivElement>(null); // Correct useRef

  const { file_id } = useParams();

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [noData, setNoData] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(""); // Search field state
  const [data, setData] = useState({ name: "", description: "" });

  // Search handler
  const handleSearchChange = (e: any) => {
    setSearch(e.target.value.toLowerCase());
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
        getAllCategories(1, false);
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAllCategories = async (
    page: number,
    isScrolling: boolean = false,
    search_val = params.get("search_string") as any
  ) => {
    let queryParams = prepareQueryParams({
      page: page || 1,
      limit: 20,
      search_string: search_val,
    });

    router.replace(prepareURLEncodedParams(pathname, queryParams));
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

  const handleTextFieldChange = (e: any) => {
    const { name, value } = e.target;
    setData((prev: any) => ({ ...prev, [name]: value }));
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
  }, [search]);

  return (
    <div className="flex flex-col h-screen w-60 bg-gray text-gray-800 p-4">
      <div className="mt-14">
        <Input
          placeholder="Search categories..."
          value={search}
          type="search"
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>

      <div
        ref={categorySideBarRef} // Use ref here to target scrollable div
        className="flex-1 overflow-y-auto"
      >
        {categoryData.length > 0 ? (
          categoryData.map((data, index) => (
            <ul key={index} className="space-y-2 text-gray-600">
              <li
                onClick={() => handleCategoryFiles(data?.id)}
                className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                  isActive(`${data?.id}`)
                    ? "text-violet-500"
                    : "hover:text-violet-500"
                }`}
              >
                <Image
                  src="/dashboard/dashboard.svg"
                  alt="dashboard"
                  width={20}
                  height={20}
                  className="transition-all duration-200"
                />
                <span>{data?.name}</span>
              </li>
            </ul>
          ))
        ) : (
          <p className="text-gray-500">No categories found</p>
        )}
      </div>
    </div>
  );
};

export default CategoriesSideBar;
