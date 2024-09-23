"use client";

import { PanelLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { RootState } from "@/redux";
import { useDispatch, useSelector } from "react-redux";
import { DashboardTable } from "./dashboardtable";

import { logout } from "@/redux/Modules/userlogin/userlogin.slice";
import { useRouter } from "next/navigation";
// import StatsData from "./dummydata";
import { useState } from "react";
import StatsData from "./statsData";

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information.";

interface FileData {
  id: string;
  name: string;
  mime_type: string;
  type: string;
  size: number;
  status: string;
  url: string;
}

export function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categorydata, setCategoryData] = useState<any[]>([]);
  const [filesData, setFilesData] = useState<FileData[]>([]);
  const [noData, setNoData] = useState(false);

  return (
    <div className="flex min-h-screen w-full mt-10">
      <div className="flex flex-1 flex-col bg-muted/40 ">
        <div className="p-4 flex flex-col gap-3">
          <div className="w-full mt-5">
            <StatsData />
          </div>

          <div className="w-full">
            <DashboardTable />
          </div>
        </div>
      </div>
    </div>
  );
}
