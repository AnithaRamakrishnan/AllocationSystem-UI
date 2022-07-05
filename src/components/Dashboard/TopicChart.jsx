import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";
import {  } from "react-chartjs-2";

import { Bar } from "react-chartjs-2";
import { useTheme } from "@mui/material/styles";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const TopicChart = (props) => {
  const { preferenceData, preferencelabels, preferencecount } = props;
  ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);
  const theme = useTheme();
 
  const randomHexColor = (len) => {
    var bgColor = [];
    for (var j = 0; j < len; j++) {
      let [r, g, b] = randomRgbColor();

      let hr = r.toString(16).padStart(2, "0");
      let hg = g.toString(16).padStart(2, "0");
      let hb = b.toString(16).padStart(2, "0");
      let color=("#" + hr + hg + hb);
      bgColor.push(color.toUpperCase());
    }
    return bgColor;
  };

  const randomRgbColor = () => {
    let r = randomInteger(255);
    let g = randomInteger(255);
    let b = randomInteger(255);
    return [r, g, b];
  };

  const randomInteger = (max) => {
    return Math.floor(Math.random() * (max + 1));
  };

  const data = {
    labels: preferencelabels, 
    datasets: [
      {
        categoryPercentage: 20,
        barPercentage: 20,
        barThickness: 12,
        maxBarThickness: 10,
        data: preferenceData, 
        backgroundColor:randomHexColor(preferencecount),
        borderWidth: 1,
      },
    ],
  };
  const options = {
    indexAxis: 'y',
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false,
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: theme.palette.divider,
        }
      },
      y: {
        grid: {
          drawBorder: true,
          color: theme.palette.divider,
        },
      }
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

  return <Bar data={data} options={options} />;
};
export default TopicChart;
