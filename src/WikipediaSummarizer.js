import React, { useState } from "react";
import axios from "axios";
import "./WikipediaSummarizer.css";

const WikipediaSummarizer = () => {
  const [keywords, setKeywords] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetchSummary = async () => {
    if (!keywords.trim()) return alert("Enter at least one keyword!");
    
    setLoading(true);
    setSummary("");
    
    const formData = new FormData();
    formData.append("keywords", keywords);

    try {
      const response = await axios.post("http://127.0.0.1:8000/wikipedia_summary/", formData);
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Wikipedia Fetch Error:", error);
      alert("Failed to fetch summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wikipedia-summarizer">
      <h2>🌍 Knowledge Digest</h2>
      <input 
        type="text" 
        placeholder="Enter keywords (comma separated)..." 
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)} 
      />
      <button onClick={handleFetchSummary} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Summary"}
      </button>
      {summary && (
        <div className="summary-container">
          <strong>Summary:</strong>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default WikipediaSummarizer;