"use client";

import { DashboardTable } from "./dashboardtable";
import StatsData from "./statsData";

const DashBoard = () => {
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
};
export default DashBoard;
