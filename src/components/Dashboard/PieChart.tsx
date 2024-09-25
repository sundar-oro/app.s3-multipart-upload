import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Loader2 } from "lucide-react";

const PieChart = ({ data, loading }: { data: any; loading: boolean }) => {
  const bytesToGB = (bytes: number) =>
    (bytes / (1024 * 1024 * 1024)).toFixed(2);

  const options = {
    chart: {
      type: "pie",
      width: 300,
      height: 200,
      events: {
        load: function (this: Highcharts.Chart) {
          const chart = this;
          chart.renderer
            .label(
              `<strong>Total Storage:</Strong> <br> ${bytesToGB(
                data?.totalStorage || 0
              )} GB<br> <strong>Total Count:</Strong> <br>${
                data?.totalFileCount
              }`,
              chart.plotLeft + chart.plotWidth / 2 - 150,
              chart.plotTop + chart.plotHeight / 2 - 40
            )
            .attr({
              padding: 10,
              zIndex: 5,
            })
            .css({
              color: "#333",
              fontSize: "10px",
              textAlign: "left",
            })
            .add();
        },
      },
    },
    title: {
      text: `Total Storage Breakdown`,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },

    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name: "Storage",
        colorByPoint: true,
        data: [
          {
            name: "Images",
            y: parseFloat(
              bytesToGB(data?.storageBreakdown?.image?.storage || 0)
            ),
          },
          {
            name: "Media",
            y: parseFloat(
              bytesToGB(data?.storageBreakdown?.media?.storage || 0)
            ),
          },
          {
            name: "Documents",
            y: parseFloat(
              bytesToGB(data?.storageBreakdown?.document?.storage || 0)
            ),
          },
          {
            name: "Other",
            y: parseFloat(
              bytesToGB(data?.storageBreakdown?.other?.storage || 0)
            ),
          },
        ],
      },
    ],
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div className="ml-8">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      )}
    </div>
  );
};

export default PieChart;
