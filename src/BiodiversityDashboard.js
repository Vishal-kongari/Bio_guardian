import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DataUploadChart from "./DataUploadChart.js";
import "./BiodiversityDashboard.css";

const data = [
  { year: 2015, species: 50 },
  { year: 2016, species: 65 },
  { year: 2017, species: 80 },
  { year: 2018, species: 75 },
  { year: 2019, species: 90 },
  { year: 2020, species: 100 },
];

const biodiversityCenters = [
  { name: "Sundarbans National Park", lat: 21.9497, lng: 88.8636 },
  { name: "Kaziranga National Park", lat: 26.6666, lng: 93.33 },
  { name: "Western Ghats", lat: 10.3529, lng: 76.5123 },
  { name: "Great Himalayan National Park", lat: 31.8500, lng: 77.3667 },
  { name: "Nanda Devi Biosphere Reserve", lat: 30.4000, lng: 79.7000 },
  { name: "Manas National Park", lat: 26.6592, lng: 91.0011 },
  { name: "Periyar Wildlife Sanctuary", lat: 9.4669, lng: 77.2399 },
  { name: "Gir Forest National Park", lat: 21.1240, lng: 70.8240 },
  { name: "Silent Valley National Park", lat: 11.1234, lng: 76.1234 },
  { name: "Namdapha National Park", lat: 27.5000, lng: 96.5000 },
  { name: "Simlipal National Park", lat: 21.7562, lng: 86.3495 },
  { name: "Ranthambore National Park", lat: 26.0173, lng: 76.5026 },
];

const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const BiodiversityDashboard = () => {
  const [theme, setTheme] = useState("light");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newFiles = files.map(file => ({
        name: file.name,
        type: file.type.split('/')[1].toUpperCase(),
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        date: new Date().toLocaleDateString(),
        url: URL.createObjectURL(file),
        icon: file.type.includes('pdf') ? '📄' : '📝'
      }));
      
      setUploadedFiles([...uploadedFiles, ...newFiles]);
      setIsUploading(false);
    }, 1000);
  };

  return (
    <section className="hiii">
      <div className={`container-fluid p-5 ${theme}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold"><span role="img" aria-label="leaf">🌱</span> Biodiversity Dashboard</h1>
          <select 
            className="form-select w-auto" 
            onChange={(e) => setTheme(e.target.value)}
            value={theme}
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
            <option value="midnight-blue">Midnight Blue</option>
            <option value="forest">Forest</option>
          </select>
        </div>

        <div className="row g-4 mb-4">
          {["Total Species: 5,320", "Endangered Species: 1,230", "New Discoveries: 47", "Conservation Projects: 120"].map((item, index) => (
            <div key={index} className="col-md-3">
              <div className="card shadow-lg p-3 text-center">
                <h5 className="fw-semibold">{item.split(":")[0]}</h5>
                <p className="fs-4 fw-bold">{item.split(":")[1]}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card p-4 shadow-lg rounded-3">
              <h5 className="fw-bold mb-3">📈 Biodiversity Over Time</h5>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="species" stroke="#28a745" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-4 shadow-lg rounded-3">
              <h5 className="fw-bold mb-3">🌍 Biodiversity Map (India)</h5>
              <MapContainer center={[22, 79]} zoom={5.5} className="w-100" style={{ height: "300px" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {biodiversityCenters.map((center, index) => (
                  <Marker key={index} position={[center.lat, center.lng]} icon={redIcon}>
                    <Popup><b>{center.name}</b></Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-4">
          <div className="col-md-6">
            <div className="card p-4 shadow-lg rounded-3">
              <h5 className="fw-bold mb-3">Recent Updates</h5>
              <ul className="list-unstyled">
                <li>🌱 New species discovered in Amazon rainforest.</li>
                <li>🌎 Conservation project launched in Africa.</li>
                <li>🦜 Study reveals migration patterns of rare birds.</li>
              </ul>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card p-4 shadow-lg rounded-3 h-100">
              <h5 className="fw-bold mb-3">Contribute to Biodiversity</h5>
              
              <div className="mb-4">
                <input 
                  type="file" 
                  id="report-upload" 
                  className="form-control" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileUpload}
                  multiple
                  style={{ display: 'none' }}
                />
                <label 
                  htmlFor="report-upload" 
                  className="btn btn-success w-100 d-flex align-items-center justify-content-center"
                  style={{ cursor: 'pointer' }}
                >
                  {isUploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Uploading...
                    </>
                  ) : (
                    '📤 Upload Report'
                  )}
                </label>
                <p className="text-muted small mt-2">Accepted formats: PDF, DOC, DOCX</p>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="uploaded-files-container">
                  <h6 className="fw-semibold mb-3">Uploaded Reports:</h6>
                  <div className="uploaded-files-list">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="uploaded-file-item d-flex align-items-center mb-2 p-2 bg-light rounded">
                        <span className="file-icon me-2 fs-5">{file.icon}</span>
                        <div className="file-details flex-grow-1">
                          <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-decoration-none d-block"
                          >
                            <strong>{file.name}</strong>
                          </a>
                          <small className="text-muted">
                            {file.type} • {file.size} • {file.date}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row g-4 mt-4">
          <div className="col-md-12">
            <div className="card p-4 shadow-lg rounded-3">
  
              <DataUploadChart /> 
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BiodiversityDashboard;