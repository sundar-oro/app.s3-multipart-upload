"use client";

import { DashboardTable } from "./dashboardtable";
import StatsData from "./statsData";

const DashBoard = () => {
  return (
    <div className="flex flex-col w-full mt-5 justify-center">
      <div className="flex flex-col w-full gap-5">
        <div className="w-full">
          <StatsData />
        </div>
        <div className="w-full">
          <DashboardTable />
        </div>
      </div>
    </div>
  );
};
export default DashBoard;
