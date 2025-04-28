import React, { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import PasteColumns from "./components/PasteColumns";
import MatchColumns from "./components/matchcolumns";
import axios from "axios";

function App() {
  const [cleanedColumns, setCleanedColumns] = useState([]);
  const [matches, setMatches] = useState([]);
  const [detectedHeaders, setDetectedHeaders] = useState([]);
  const [filePath, setFilePath] = useState("");
  const [preview, setPreview] = useState(null);

  const BACKEND_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080"
      : "https://xcellent.onrender.com";

  // Fetch preview automatically when matches + filePath are ready
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

  const handleExport = async (format) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/export`,
        { matches, file_path: filePath, format },
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `exported_data.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(`${format.toUpperCase()} export error:`, error);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Source Sans Pro', sans-serif",
        backgroundColor: "#1a1a1a",
        color: "#eee",
        margin: 0,
        padding: 0,
      }}
    >
      {/* 🌌 Banner */}
      <section
        id="banner"
        style={{
          background: "linear-gradient(135deg, #5e42a6, #b74e91)",
          color: "#fff",
          textAlign: "center",
          padding: "6em 2em",
          position: "relative",
        }}
      >
        <h1 style={{ fontSize: "3rem", margin: 0, color: "black" }}>
          Xcellent
        </h1>
        <p
          style={{
            fontSize: "1.3rem",
            opacity: 0.9,
            marginTop: "1rem",
            color: "black",
          }}
        >
          Your AI-powered Excel-to-database tool
        </p>
      </section>

      {/* 🧠 Step-by-step Area */}
      <section style={{ padding: "3em 2em", background: "#1f1f1f" }}>
        {/* Step 1 */}
        <div style={{ marginBottom: "4em" }}>
          <h2 style={{ fontSize: "2rem", color: "#b97df2" }}>
            Step 1: Upload File
          </h2>
          <p>Upload your Excel file below</p>
          <FileUpload
            setDetectedHeaders={setDetectedHeaders}
            detectedHeaders={detectedHeaders}
            setFilePath={setFilePath}
          />
        </div>

        {/* Step 2 */}
        <div style={{ marginBottom: "4em" }}>
          <h2 style={{ fontSize: "2rem", color: "#b97df2" }}>
            Step 2: Desired Columns or Data
          </h2>
          <p>
            Input desired column names or Paste raw SQL output from{" "}
            <code>DESCRIBE</code> or <code>SHOW COLUMNS</code> — we’ll clean it
            for you!
          </p>
          <PasteColumns
            setCleanedColumns={setCleanedColumns}
            setMatches={setMatches}
            detectedHeaders={detectedHeaders}
          />
        </div>

        {/* Step 3 */}
        <div style={{ marginBottom: "4em" }}>
          <h2 style={{ fontSize: "2rem", color: "#b97df2" }}>
            Step 3: Match Columns
          </h2>
          <MatchColumns
            cleanedColumns={cleanedColumns}
            matches={matches}
            detectedHeaders={detectedHeaders}
          />
        </div>

        {/* Step 4 */}
        <div>
          <h2 style={{ fontSize: "2rem", color: "#b97df2" }}>
            Step 4: Preview & Export
          </h2>
          {preview && (
            <div style={{ marginTop: "2rem", overflowX: "auto" }}>
              <h3 style={{ color: "#b97df2", marginBottom: "1rem" }}>
                Preview Table
              </h3>
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

          {/* Export Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "2rem",
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
            <button
              onClick={() => handleExport("xlsx")}
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
              Export as XLSX
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
