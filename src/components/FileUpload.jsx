import React, { useState } from "react";
import axios from "axios";
import { Button, CircularProgress, Typography } from "@mui/material";
import { purpleButtonStyle } from "../styles";
import "./matchresults.css";

const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://xcellent.onrender.com";

console.log("🚀 FormData being sent:", formData);
console.log("🧾 Entries:", [...formData.entries()]);
    
const FileUpload = ({ setDetectedHeaders, detectedHeaders, setFilePath }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [suggestedMatches, setSuggestedMatches] = useState(null);
  const [error, setError] = useState("");
  const [sqlPaste, setSqlPaste] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError("");
  };

  const extractColumnNames = (sqlText) => {
    const lines = sqlText.split("\n");
    const columns = [];

    for (let line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length > 0 && parts[0].match(/^[a-zA-Z0-9_]+$/)) {
        columns.push(parts[0]);
      }
    }

    return columns;
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const userColumns = extractColumnNames(sqlPaste);
    formData.append(
      "columns",
      JSON.stringify(userColumns.length > 0 ? userColumns : []),
    );

    try {
      const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
      });

      setSuggestedMatches(response.data.suggested_matches || {});
      setFilePath(response.data.processed_file_path || "");
      setDetectedHeaders(response.data.detected_headers || []);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 600,
        margin: "auto",
        textAlign: "center",
      }}
    >
      <input type="file" onChange={handleFileChange} accept=".xlsx" />

      {uploading ? (
        <CircularProgress style={{ margin: 20 }} />
      ) : (
        <Button onClick={handleUpload} style={purpleButtonStyle}>
          Upload
        </Button>
      )}

      {error && <Typography color="error">{error}</Typography>}

      {detectedHeaders.length > 0 && (
        <div className="table-container">
          <Typography variant="h6">Recognized Columns</Typography>
          <ul
            style={{
              listStyle: "none",
              paddingLeft: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              justifyContent: "center",
            }}
          >
            {detectedHeaders.map((col, index) => (
              <li
                key={index}
                style={{
                  background: "#2a2a2a",
                  color: "#eee",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  border: "1px solid #3e3e3e",
                  boxShadow: "0 0 5px rgba(124, 77, 255, 0.2)",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {col}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
