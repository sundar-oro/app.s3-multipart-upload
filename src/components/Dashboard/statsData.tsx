"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { getStatsApi } from "@/lib/services/dashboard";
import PieChart from "./PieChart";
import CountUp from "react-countup";
import Loading from "../Core/loading";
import { toast } from "sonner";

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
    <>
      <div className="bg-gray-100 flex justify-center">
        <Card className="w-full bg-white shadow-lg rounded-lg p-6 h-[40%]">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="w-1/5 flex justify-start">
              <PieChart data={data} loading={loading} />
            </div>

            {/* Storage Breakdown Section */}

            <div className="lg:w-2/3 grid grid-cols-4 gap-4 h-24">
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
                  value: bytesToGB(
                    data?.storageBreakdown?.document?.storage || 0
                  ),
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
                  className={`p-4 ${item.color} rounded-lg shadow`}
                >
                  <h3 className="font-semibold text-gray-700">{item.label}</h3>
                  <p className="text-lg font-bold">{item.value} GB</p>
                  <p className="text-sm text-gray-600">{item.count} files</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <Loading loading={loading} />
    </>
  );
};

export default StatsData;
