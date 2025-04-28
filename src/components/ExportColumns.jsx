import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Typography } from "@mui/material";
import { purpleButtonStyle } from "../styles";

const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://xcellent.onrender.com";

const ExportColumns = ({ matches, filePath }) => {
  const [preview, setPreview] = useState(null);

  // Automatically fetch preview when matches and filePath are ready
  useEffect(() => {
    const fetchPreview = async () => {
      if (matches.length && filePath) {
        try {
          const response = await axios.post(`${BACKEND_URL}/api/export`, {
            matches,
            file_path: filePath,
            format: "preview",
          });
          setPreview(response.data.preview);
        } catch (error) {
          console.error("Preview fetch error:", error);
        }
      }
    };

    fetchPreview();
  }, [matches, filePath]);

  const handleExport = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/export`,
        { matches, file_path: filePath, format: "xlsx" },
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "exported_data.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("XLSX export error:", error);
    }
  };

  return (
    <div style={{ marginTop: "2rem", textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() => handleExport("csv")}
          style={{
            background: "#5e42a6",
            color: "#fff",
            padding: "0.75em 2em",
            fontSize: "1rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Export as CSV
        </button>
        <Button onClick={() => handleExport("xlsx")} style={purpleButtonStyle}>
          Export as XLSX
        </Button>
      </div>

      {preview && (
        <div style={{ marginTop: "2rem", overflowX: "auto" }}>
          <Typography
            variant="h6"
            style={{ color: "#b97df2", marginBottom: "1rem" }}
          >
            Preview Table
          </Typography>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {preview.headers.map((header, idx) => (
                  <th
                    key={idx}
                    style={{
                      border: "1px solid #3e3e3e",
                      padding: "0.5rem",
                      backgroundColor: "#2a2a2a",
                      color: "#fff",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.rows.map((row, idx) => (
                <tr key={idx}>
                  {row.map((cell, cid) => (
                    <td
                      key={cid}
                      style={{
                        border: "1px solid #3e3e3e",
                        padding: "0.5rem",
                        color: "#ccc",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExportColumns;
