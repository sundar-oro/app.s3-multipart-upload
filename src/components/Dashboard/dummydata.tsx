"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { getStatsApi } from "@/lib/services/dashboard";
import { Pie, PieChart, LabelList } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const StatsData = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [showPieData, setShowPieData] = useState<any>();
  const [chartConfig, setChartConfig] = useState<any>({});

  const user = useSelector((state: RootState) => state?.user);

  const fetchStatsData = async () => {
    try {
      setLoading(true);
      const response = await getStatsApi(user?.access_token);
      setData(response.data);

      // Step 1: Create chartData from storageBreakdown
      const chartData = response.data
        ? Object.entries(response.data.storageBreakdown).map(
            ([key, value]: any) => ({
              name: key,
              value: +value?.storage, // Convert to number
              fill: `var(--color-${key.toLowerCase()})`, // Dynamic fill color
            })
          )
        : [];

      const transformedShowPieData = chartData.map(({ name, value, fill }) => ({
        name,
        value: +bytesToGB(value),
        fill,
      }));

      setShowPieData(transformedShowPieData);

      // Step 3: Create chartConfig from chartData
      const newChartConfig = chartData.reduce((acc, { name }) => {
        acc[name] = {
          label: name,
          color: `var(--color-${name.toLowerCase()})`,
        };
        return acc;
      }, {} as Record<string, { label: string; color: string }>);

      setChartConfig(newChartConfig);
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, []);

  const bytesToGB = (bytes: number) =>
    (bytes / (1024 * 1024 * 1024)).toFixed(2);

  return (
    <div className="bg-gray-100 flex justify-center">
      <Card className="w-full bg-white shadow-lg rounded-lg p-6 h-[40%]">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="w-1/5 flex justify-start">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={showPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                >
                  <LabelList
                    dataKey="name"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          {/* Storage Breakdown Section */}
          <div className="lg:w-2/3 grid grid-cols-4 gap-4 h-24">
            {[
              {
                label: "Images",
                value: bytesToGB(data?.storageBreakdown?.image?.storage || 0),
                count: data?.storageBreakdown?.image?.count || 0,
                color: "bg-blue-100",
              },
              {
                label: "Documents",
                value: bytesToGB(
                  data?.storageBreakdown?.document?.storage || 0
                ),
                count: data?.storageBreakdown?.document?.count || 0,
                color: "bg-green-100",
              },
              {
                label: "Media Files",
                value: bytesToGB(data?.storageBreakdown?.media?.storage || 0),
                count: data?.storageBreakdown?.media?.count || 0,
                color: "bg-orange-100",
              },
              {
                label: "Other Files",
                value: bytesToGB(data?.storageBreakdown?.other?.storage || 0),
                count: data?.storageBreakdown?.other?.count || 0,
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
  );
};

export default StatsData;
