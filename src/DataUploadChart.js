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
import "./DataUploadChart.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DataUploadChart = () => {
  const [chartData, setChartData] = useState(null);
  const [speciesMap, setSpeciesMap] = useState({});
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("❌ Only .xlsx and .csv files are allowed.");
      return;
    }

    setErrorMessage("");
    setFileName(file.name);

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
    if (!data || data.length === 0) {
      setErrorMessage("❌ File is empty or couldn't be read.");
      return;
    }

    const firstRow = data[0];
    const yearKey = Object.keys(firstRow).find((key) => key.toLowerCase().includes("year"));
    const countKey = Object.keys(firstRow).find((key) => key.toLowerCase().includes("count"));
    const speciesKey = Object.keys(firstRow).find((key) => key.toLowerCase().includes("species name"));

    if (!yearKey || !countKey || !speciesKey) {
      setErrorMessage("❌ Invalid file format! Required columns: 'Year', 'Species Count', 'Species Name'");
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
    <div className="chart-container">
      <h2 className="upload-title">🌱 Upload Biodiversity Dataset</h2>
      
      <div className="upload-controls">
        <div className="file-upload-wrapper">
          <input
            id="fileUpload"
            type="file"
            accept=".xlsx, .csv"
            onChange={handleFileUpload}
            className="file-input"
          />
          <label htmlFor="fileUpload" className="file-button">
            📁 Upload Dataset
          </label>
        </div>
        
        <div className="file-info">
          <p className="file-info-text">📁 File format: .xlsx and .csv</p>
          <p className="file-info-text">🧾 Required columns: 'Year', 'Species Count', 'Species Name'</p>
        </div>
        
        {fileName && (
          <span className="file-name">✅ {fileName}</span>
        )}
      </div>

      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}

      {chartData && (
        <div className="chart-content">
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