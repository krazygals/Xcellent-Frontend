import React, { useState } from "react";
import axios from "axios";
import { Button, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import TextareaAutosize from "@mui/base/TextareaAutosize";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [suggestedMatches, setSuggestedMatches] = useState(null);
  const [error, setError] = useState("");

  // Handle file selection
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
  
  // Handle file upload
const handleUpload = async () => {
  if (!selectedFile) {
    setError("Please select a file first.");
    return;
  }

  const userColumns = extractColumnNames(sqlPaste);
  if (userColumns.length === 0) {
    setError("Please paste valid SQL output before uploading.");
    return;
  }

  setUploading(true);
  setError("");

  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("columns", JSON.stringify(userColumns)); // now using extracted columns

  try {
    const response = await axios.post("https://xcellent.onrender.com/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setSuggestedMatches(response.data.suggested_matches);
  } catch (err) {
    setError("Upload failed. Please try again.");
  } finally {
    setUploading(false);
  }
};

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>Upload an Excel File</Typography>
      
      <input type="file" onChange={handleFileChange} accept=".xlsx" />
      
      {uploading ? (
        <CircularProgress style={{ margin: 20 }} />
      ) : (
        <Button variant="contained" color="primary" onClick={handleUpload} style={{ margin: 20 }}>
          Upload
        </Button>
      )}

      {error && <Typography color="error">{error}</Typography>}

      {suggestedMatches && (
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Typography variant="h6">Suggested Column Matches</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Column</TableCell>
                <TableCell>Matched Column</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(suggestedMatches).map(([userColumn, matchedColumn]) => (
                <TableRow key={userColumn}>
                  <TableCell>{userColumn}</TableCell>
                  <TableCell>{matchedColumn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default FileUpload;
