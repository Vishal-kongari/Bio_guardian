import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, Button, Card, Modal, Image, Form, Spinner, ProgressBar } from "react-bootstrap";
import "./App.css";
import BiodiversityDashboard from "./BiodiversityDashboard";
import WikipediaSummarizer from "./WikipediaSummarizer";

function App() {
    // State for Upload Image/Video Section
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [fileName, setFileName] = useState("📂 Choose a file...");
    const [response, setResponse] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [loading, setLoading] = useState(false);

    // State for Document Summarization Section
    const [docFile, setDocFile] = useState(null);
    const [docFileName, setDocFileName] = useState("📂 Choose a document...");
    const [docSummary, setDocSummary] = useState(null);
    const [docLoading, setDocLoading] = useState(false);

    // State for Satellite Image Analysis Section
    const [pastImage, setPastImage] = useState(null);
    const [recentImage, setRecentImage] = useState(null);
    const [report, setReport] = useState("");
    const [processedImage, setProcessedImage] = useState(null);
    const [showForestModal, setShowForestModal] = useState(false);
    const [forestLoading, setForestLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange1 = (e, setImage) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleAnalyze = async () => {
        if (!pastImage || !recentImage) {
            setError("Please upload both past and recent images.");
            return;
        }

        setError("");
        setForestLoading(true);

        const formData = new FormData();
        formData.append("past", pastImage);
        formData.append("recent", recentImage);

        try {
            const response = await fetch("http://localhost:8000/analyze", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setReport(data.report);

            if (data.processed_image) {
                if (data.processed_image.startsWith("/")) {
                    setProcessedImage(`http://localhost:8000${data.processed_image}`);
                } else if (data.processed_image.startsWith("data:image")) {
                    setProcessedImage(data.processed_image);
                } else {
                    setError("Invalid image format received.");
                }
                setShowForestModal(true);
            } else {
                setError("Processed image not received from the server.");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("An error occurred while processing the images.");
        }
        setForestLoading(false);
    };

    const fetchLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => console.error("Error fetching location:", error)
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile));
            setFileName(`📁 ${selectedFile.name}`);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        if (!latitude || !longitude) {
            alert("Unable to get location. Please allow location access and try again.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);

        try {
            const res = await axios.post("http://localhost:8000/upload/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.confidence === undefined) {
                throw new Error("Invalid response format");
            }

            setResponse(res.data);
            setShowUploadModal(true);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Error uploading file. Please try again.");
        } finally {
            setLoading(false);
            setFile(null);
            setFilePreview(null);
            setFileName("📂 Choose a file...");
            document.getElementById("fileInput").value = "";
        }
    };

    const handleDocChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setDocFile(selectedFile);
            setDocFileName(`📁 ${selectedFile.name}`);
        }
    };

    const handleDocUpload = async () => {
        if (!docFile) {
            alert("Please select a document to summarize.");
            return;
        }

        setDocLoading(true);
        const formData = new FormData();
        formData.append("file", docFile);

        try {
            const res = await axios.post("http://localhost:8000/summarize_pdf/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data && res.data.summary) {
                setDocSummary(res.data.summary);
            } else {
                alert("Unexpected response format. Check console.");
                console.error("Unexpected response:", res.data);
            }
        } catch (error) {
            console.error("Document summarization failed", error);
            alert("Error summarizing document. Please try again.");
        } finally {
            setDocLoading(false);
        }
    };

    return (
        <>
            <Navbar expand="lg" className="gradient-navbar" variant="dark" fixed="top">
                <Container>
                    <Navbar.Brand href="#home" className="navbar-brand">🌿 Bio Guardian</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="#home" className="nav-link">Home</Nav.Link>
                            <Nav.Link href="#about" className="nav-link">About</Nav.Link>
                            <Nav.Link href="#upload" className="nav-link">Upload</Nav.Link>
                            <Nav.Link href="#contact" className="nav-link">Contact</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Hero Section - White Text */}
            <section id="home" className="hero-section">
                <Container className="text-center hero-content">
                <h1 className="hero-heading">Guarding Nature with AI 🌏</h1>


                    <p className="lead text-white hero-subheading">Analyze images & videos to detect endangered species. Let's protect wildlife together! 🦜🌿</p>
                    <a href="#upload"><Button className="custom-button pulse-animation" size="lg">Start Analyzing 🧐</Button></a>
                </Container>
            </section>

            {/* About Section - Black Text */}
            <section id="about" className="about-section py-5">
                <Container>
                    <h2 className="text-center mb-4">🌍 About Bio Guardian</h2>
                    <p className="text-center mb-4">
                        Bio Guardian is an AI-powered system that analyzes images and videos to identify endangered species.
                        It helps conservationists protect wildlife by detecting threats and monitoring biodiversity.
                    </p>
                    <h4 className="text-center mb-3">Why it matters?</h4>
                    <p className="text-center">
                        With growing environmental threats, Bio Guardian empowers organizations, wildlife researchers, and governments with real-time insights to take timely action and protect nature.
                        It's a powerful tool in the fight against biodiversity loss and climate change.
                    </p>
                </Container>
            </section>

            {/* Upload Section - Black Text */}
            <section id="upload" className="upload-section py-5">
                <Container className="text-center">
                    <h2 className="text-center mb-4">Upload Image 📷</h2>
                    <Card className="p-4 mx-auto upload-card">
                        <Form.Group controlId="fileInput" className="mb-4">
                            <Form.Label className="custom-file-label d-block">{fileName}</Form.Label>
                            <Form.Control type="file" accept="image/*,video/*" onChange={handleFileChange} hidden />
                        </Form.Group>
                        {filePreview && (
                            <div className="mb-4 preview-container">
                                {file?.type?.startsWith("image/") ? (
                                    <Image src={filePreview} alt="Preview" thumbnail className="preview-image" />
                                ) : (
                                    <video controls className="preview-video">
                                        <source src={filePreview} type={file?.type} />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        )}
                        <Button className="custom-button w-100" onClick={handleUpload} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : "Analyze 🧐"}
                        </Button>
                    </Card>
                </Container>
            </section>

            {/* Modal for Upload Results */}
            <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>🌿 AI Wildlife Analysis</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {response ? (
                        <div className="analysis-results">
                            <h4>🐾 Identified Species: <strong>{response.species}</strong></h4>
                            <div className="confidence-meter">
                                <h5>📊 Confidence:</h5>
                                <ProgressBar
                                    now={response.confidence}
                                    label={`${response.confidence.toFixed(2)}%`}
                                    variant={response.confidence > 80 ? "success" : "warning"}
                                />
                            </div>
                            <h5 className="location-link">
                                📍 Location:{" "}
                                <a
                                    href={`https://www.google.com/maps?q=${response.latitude},${response.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View on Maps
                                </a>
                            </h5>
                            <h5 className="count-display">🔢 Count: <strong>{response.count}</strong></h5>
                        </div>
                    ) : (
                        <Spinner animation="border" />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => setShowUploadModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <section className="wikipedia-section py-5 bg-light">
                <Container>
                    <WikipediaSummarizer />
                </Container>
            </section>

            {/* Document Summarization Section - Black Text */}
            <section id="summarize" className="document-section py-5">
                <Container className="text-center">
                    <h2 className="text-center mb-4"> Research Snapshot 📜</h2>
                    <Card className="p-4 mx-auto upload-card">
                        <Form.Group controlId="docFileInput" className="mb-4">
                            <Form.Label className="custom-file-label d-block">{docFileName}</Form.Label>
                            <Form.Control type="file" accept=".txt,.pdf" onChange={handleDocChange} hidden />
                        </Form.Group>

                        <Button className="custom-button w-100 mb-3" onClick={handleDocUpload} disabled={docLoading}>
                            {docLoading ? <Spinner animation="border" size="sm" /> : "Summarize 📄"}
                        </Button>
                        {docSummary && (
                            <Card className="mt-3 p-3 summary-card">
                                <h5 className="summary-title">Summary:</h5>
                                <p className="summary-text">{docSummary}</p>
                            </Card>
                        )}
                    </Card>
                </Container>
            </section>

            {/* Biodiversity Dashboard */}
            <div className="py-5">
                <BiodiversityDashboard />
            </div>

            {/* Satellite Image Analysis Section - Black Text */}
            <section id="forest" className="forest-section py-5">
                <Container className="text-center">
                    <h2 className="text-center mb-4">🌲 Satellite Image Analysis 📷</h2>
                    <Card className="p-4 mx-auto forest-card">
                        <Form.Group controlId="pastImageUpload" className="mb-4">
                            <Form.Label className="upload-label">Upload Past Image</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={(e) => handleFileChange1(e, setPastImage)} />
                            {pastImage && <Image src={URL.createObjectURL(pastImage)} thumbnail className="mt-3 preview-image" />}
                        </Form.Group>

                        <Form.Group controlId="recentImageUpload" className="mb-4">
                            <Form.Label className="upload-label">Upload Recent Image</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={(e) => handleFileChange1(e, setRecentImage)} />
                            {recentImage && <Image src={URL.createObjectURL(recentImage)} thumbnail className="mt-3 preview-image" />}
                        </Form.Group>

                        <Button className="custom-button w-100" onClick={handleAnalyze} disabled={forestLoading}>
                            {forestLoading ? <Spinner animation="border" size="sm" /> : "Analyze 🧐"}
                        </Button>

                        {error && <p className="mt-3 text-danger error-message">{error}</p>}
                    </Card>
                </Container>
            </section>
{/* Forest Analysis Modal */}
<Modal
  show={showForestModal}
  onHide={() => setShowForestModal(false)}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>🌿 AI Forest Analysis</Modal.Title>
  </Modal.Header>

  <Modal.Body>
  {processedImage && (
  <div className="d-flex justify-content-center mt-3">
    <Image
      src={processedImage}
      alt="Processed"
      thumbnail
      className="processed-image"
    />
  </div>
)}

    {report && (
      <pre className="forest-report formatted-report">
        {report}
      </pre>
    )}

    
  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowForestModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>



            {/* Footer */}
            <footer className="gradient-footer text-center py-4">
                <Container>
                    <p className="m-0 text-white">© 2025 Bio Guardian | AI for Wildlife Protection</p>
                </Container>
            </footer>
        </>
    );
}

export default App;