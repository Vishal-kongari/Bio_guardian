import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "animate.css";
import "./DataUploadChart.css"; // ⬅️ Import CSS file

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DataUploadChart = () => {
  const [chartData, setChartData] = useState(null);
  const [speciesMap, setSpeciesMap] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      processChartData(sheet);
    };
  };

  const processChartData = (data) => {
    if (!data || data.length === 0) return;

    const firstRow = data[0];
    const yearKey = Object.keys(firstRow).find((key) => key.toLowerCase().includes("year"));
    const countKey = Object.keys(firstRow).find((key) => key.toLowerCase().includes("count"));
    const speciesKey = Object.keys(firstRow).find((key) => key.toLowerCase().includes("species name"));

    if (!yearKey || !countKey || !speciesKey) {
      alert("Invalid file format! Ensure it has 'Year', 'Species Count', and 'Species Name' columns.");
      return;
    }

    const labels = data.map((row) => row[yearKey]);
    const values = data.map((row) => row[countKey]);
    const speciesData = data.reduce((acc, row) => {
      acc[row[yearKey]] = row[speciesKey];
      return acc;
    }, {});

    setSpeciesMap(speciesData);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: "🦋 Species Count",
          data: values,
          backgroundColor: "rgba(129, 230, 217, 0.7)",
          borderColor: "#4fd1c5",
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    });
  };

  return (
    <div className="chart-container animate__animated animate__fadeInUp">
      <h2 className="upload-title">🌱 Upload Biodiversity Dataset</h2>
      <input
        type="file"
        accept=".xlsx, .csv"
        onChange={handleFileUpload}
        className="file-input"
      />

      {chartData && (
        <div>
          <h3 className="chart-title">📊 Biodiversity Trends</h3>
          <div className="chart-wrapper">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    labels: {
                      color: "#4a5568",
                      font: { size: 14 },
                    },
                  },
                  title: {
                    display: true,
                    text: "📈 Species Diversity Over Years",
                    color: "#2d3748",
                    font: { size: 18 },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        let year = context.label;
                        let count = context.raw;
                        let species = speciesMap[year] || "Unknown";
                        return `Count: ${count} | Species: ${species}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: { color: "#2d3748" },
                    grid: { display: false },
                  },
                  y: {
                    ticks: { color: "#2d3748" },
                    grid: { color: "#edf2f7" },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataUploadChart;
