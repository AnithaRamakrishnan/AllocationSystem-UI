import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTheme } from "@mui/material/styles";

const SubmissionChart = (props) => {
  const { stupiechartData, stupiechartlabels } = props;
  ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);
  const theme = useTheme();
  const data = {
    labels: stupiechartlabels,
    datasets: [
      {
        data: stupiechartData,
        backgroundColor: ["rgb(255, 99, 132)","#5C4F8C"],
        borderWidth: 2,
        borderColor: theme.palette.background.default,
        hoverBorderColor: theme.palette.background.default,
      },
    ],
  };
  const options = {
    labels: stupiechartlabels,
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
      outlabels: {
        display: true,
        borderWidth: 2,
        lineWidth: 2,
        padding: 3,
        textAlign: "center",
        stretch: 15,
        font: {
          resizable: true,
          minSize: 12,
          maxSize: 18,
        },
        valuePrecision: 1,
        percentPrecision: 2,
      },
    },
  };
  return <Doughnut data={data} options={options} />;
};
export default SubmissionChart;
