"use client";

import { getStatsApi } from "@/lib/services/dashboard";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LabelList, Pie, PieChart } from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";

const StatsData = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>();
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state?.user);
  console.log(user?.access_token);

  const chartData = [
    { browser: "Chrome", visitors: 25, fill: "var(--color-chrome)" },
    { browser: "Safari  ", visitors: 200, fill: "var(--color-safari)" },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const fetchStatsData = async () => {
    try {
      setLoading(true);
      const response = await getStatsApi(user?.access_token);
      setData(response.data); // Assuming response.data is the actual data object.
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, []);

  const bytesToMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

  return (
    <Card className="overflow-hidden mb-0 w-130 mt-0 mr-0 bg-white shadow-lg p-4  px-3">
      {/* <CardHeader>
        <CardTitle>Storage Stats</CardTitle>
      </CardHeader> */}
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors">
              <LabelList
                dataKey="browser"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* <p className="text-lg font-semibold">
          Total Storage: {data?.totalStorageInMB ? data?.totalStorageInMB : 0}{" "}
          MB
        </p> */}

        <h3 className="mt-4 mb-2 font-semibold">Storage Breakdown:</h3>

        <ul className="space-y-3">
          <li className="flex justify-between">
            <div>
              <span>Images</span>
              <div>{data?.storageBreakdown?.image?.count || 0} files</div>
              <br />
            </div>
            <span>
              {bytesToMB(data?.storageBreakdown?.image?.storage || 0)} MB
            </span>
          </li>

          <li className="flex justify-between">
            <div>
              <span>Media</span>
              <div>{data?.storageBreakdown.media?.count || 0} files</div>
              <br />
            </div>
            <span>
              {bytesToMB(data?.storageBreakdown.media?.storage || 0)} MB
            </span>
          </li>
          <li className="flex justify-between">
            <div>
              <span>Documents</span>
              <div>{data?.storageBreakdown.document?.count || 0} files, </div>
              <br />
            </div>
            <span>
              {bytesToMB(data?.storageBreakdown.document?.storage || 0)} MB
            </span>
          </li>

          <li className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src="/dashboard/dashboard.svg"
                alt="dashboard"
                width={20}
                height={20}
                className="transition-all duration-200"
              />
              <div className="flex flex-col">
                <span>Other</span>
                <span>{data?.storageBreakdown.other?.count || 0} files</span>
              </div>
            </div>

            <span>
              {bytesToMB(data?.storageBreakdown.other?.storage || 0)} MB
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default StatsData;
