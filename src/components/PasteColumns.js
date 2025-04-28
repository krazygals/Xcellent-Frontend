import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { purpleButtonStyle } from "../styles";
import "./matchresults.css";

const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://xcellent.onrender.com";

const PasteColumns = ({ setCleanedColumns, setMatches, detectedHeaders }) => {
  const [rawText, setRawText] = useState("");

  const extractColumnNames = (input) => {
    // Try to detect Excel-style paste (tabs or commas)
    if (input.includes("\t") || input.includes(",")) {
      // Excel paste detected
      return input
        .split(/[\t,]/)
        .map((col) => col.trim())
        .filter(Boolean);
    }

    // Otherwise, assume SQL-style paste
    const lines = input.split(/\r?\n/);
    const columns = [];

    for (let line of lines) {
      let match =
        line.match(/\|\s*([a-zA-Z0-9_]+)/) || line.match(/^\s*([a-zA-Z0-9_]+)/);
      if (match && match[1]) {
        columns.push(match[1].trim());
      }
    }

    const unique = [...new Set(columns.filter(Boolean))];
    return unique;
  };

  const handleClean = async () => {
    const columns = extractColumnNames(rawText);
    setCleanedColumns(columns);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/match-columns`, {
        recognized_columns: detectedHeaders,
        user_columns: columns,
      });
      console.log("API match response:", response.data); // ✅ Correct placement
      setMatches(response.data.matches); // change from suggested_matches to matches
    } catch (error) {
      console.error("Match error:", error);
      setMatches(null);
    }
  };

  return (
    <>
      <div className="table-container">
        <Typography variant="h6">Input Columns</Typography>
        <TextField
          multiline
          rows={10}
          fullWidth
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          InputProps={{
            style: {
              color: "#fff",
              backgroundColor: "#1c1c1c",
              borderRadius: "8px",
            },
          }}
          sx={{ mt: 2 }}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <Button onClick={handleClean} style={purpleButtonStyle}>
          Clean & Preview
        </Button>
      </div>
    </>
  );
};

export default PasteColumns;
