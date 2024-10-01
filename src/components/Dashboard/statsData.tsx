"use client";

import { getStatsApi } from "@/lib/services/dashboard";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { toast } from "sonner";
import Loading from "../Core/loading";
import PieChart from "./PieChart";

const StatsData = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});

  const GetStatsData = async () => {
    setLoading(true);
    try {
      const response = await getStatsApi();
      if (response.status === 200 || response.status === 201) {
        setData(response?.data?.data);
      }
    } catch (error) {
      toast.error("Failed to fetch Data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetStatsData();
  }, []);

  const bytesToGB = (bytes: number) =>
    (bytes / (1024 * 1024 * 1024)).toFixed(2);

  return (
    <div className="flex flex-row justify-center items-center w-full gap-20 ">
      <div className="w-1/5 flex">
        <PieChart data={data} loading={loading} />
      </div>

      <div className="w-2/3 flex flex-row gap-3">
        {[
          {
            label: "Images",
            value: bytesToGB(data?.storageBreakdown?.image?.storage || 0),
            count: (
              <CountUp
                end={data?.storageBreakdown?.image?.count || 0}
                duration={5}
              />
            ),
            color: "bg-blue-100",
          },
          {
            label: "Documents",
            value: bytesToGB(data?.storageBreakdown?.document?.storage || 0),
            count: (
              <CountUp
                end={data?.storageBreakdown?.document?.count || 0}
                duration={5}
              />
            ),
            color: "bg-green-100",
          },
          {
            label: "Media Files",
            value: bytesToGB(data?.storageBreakdown?.media?.storage || 0),
            count: (
              <CountUp
                end={data?.storageBreakdown?.media?.count || 0}
                duration={5}
              />
            ),
            color: "bg-orange-100",
          },
          {
            label: "Other Files",
            value: bytesToGB(data?.storageBreakdown?.other?.storage || 0),
            count: (
              <CountUp
                end={data?.storageBreakdown?.other?.count || 0}
                duration={5}
              />
            ),
            color: "bg-yellow-100",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={` p-[16px] w-1/4 ${item.color} rounded-lg shadow`}
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col">
                <p className="font-primary text-[#000000] text-[18px]">
                  {item.label}
                </p>
                <p className="text-sm text-gray-600">{item.count} files</p>
              </div>
              <p className="text-[20px] text-[#135CFD]">{item.value} GB</p>
            </div>
          </div>
        ))}
      </div>
      <Loading loading={loading} />
    </div>
  );
};

export default StatsData;
