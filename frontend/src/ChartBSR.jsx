import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
  Tooltip
} from "chart.js";
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip);

const ChartBSR = ({ priceHistory, bsrHistory }) => {
  if (!priceHistory || !bsrHistory) return null;
  const labels = Array(priceHistory.length).fill().map((_, i) => `Day ${i + 1}`);
  const data = {
    labels,
    datasets: [
      { label: "Price", data: priceHistory, yAxisID: "y", fill: false, tension: 0.3 },
      { label: "BSR", data: bsrHistory, yAxisID: "y1", fill: false, borderDash: [5, 5] }
    ]
  };
  const options = {
    responsive: true,
    scales: {
      y: { type: "linear", display: true, position: "left", title: { display: true, text: "Price ($)" } },
      y1: { type: "linear", display: true, position: "right", title: { display: true, text: "BSR" }, grid: { drawOnChartArea: false } }
    }
  };
  return <div style={{ width: 180, height: 110 }}><Line data={data} options={options} /></div>;
};

export default ChartBSR;
