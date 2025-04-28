import React, { useRef, useEffect } from "react";
import { Typography } from "@mui/material";
import "./matchresults.css";

const cleanColumn = (col) => {
  return col
    .toLowerCase() // Lowercase
    .replace(/[^a-z0-9]/g, " ") // Replace non-alphanumerics with space
    .replace(/\s+/g, "_") // Collapse multiple spaces
    .trim(); // Trim leading/trailing spaces
};

const MatchColumns = ({
  cleanedColumns = [],
  detectedHeaders = [],
  matches = [],
}) => {
  const containerRef = useRef();

  console.log("🟣 Frontend received matches:", matches);
  const allRecognized = Array.from(
    document.querySelectorAll('[id^="left-"]'),
  ).map((el) => el.id);
  const allCleaned = Array.from(
    document.querySelectorAll('[id^="right-"]'),
  ).map((el) => el.id);
  console.log("🟣 Recognized IDs:", allRecognized);
  console.log("🟢 Cleaned IDs:", allCleaned);

  useEffect(() => {
    const svg = document.getElementById("line-overlay");
    if (!svg || !matches.length) return;
    svg.innerHTML = ""; // clear old lines

    const cleanedMatches = matches.map(({ from, to }) => ({
      from: cleanColumn(from),
      to: cleanColumn(to),
    }));

    cleanedMatches.forEach(({ from, to }) => {
      console.log("Looking for left:", `left-${to}`, "right:", `right-${from}`);
      const leftEl = document.getElementById(`left-${cleanColumn(from)}`); // Recognized (AI) → Left
      const rightEl = document.getElementById(`right-${cleanColumn(to)}`); // User (Cleaned) → Right
      if (!leftEl || !rightEl) return;

      if (!leftEl || !rightEl) {
        console.log("❌ Skipping match: element not found", {
          leftEl,
          rightEl,
        });
        return; // Skip drawing if elements are missing
      }

      const leftRect = leftEl.getBoundingClientRect();
      const rightRect = rightEl.getBoundingClientRect();
      const parentRect = containerRef.current.getBoundingClientRect();

      console.log({
        leftTop: leftRect.top,
        rightTop: rightRect.top,
        parentTop: parentRect.top,
        leftAdjusted: leftRect.top - parentRect.top,
        rightAdjusted: rightRect.top - parentRect.top,
      });

      const x1 = leftRect.right - parentRect.left;
      const y1 = leftRect.top + leftRect.height / 2 - parentRect.top;
      const x2 = rightRect.left - parentRect.left;
      const y2 = rightRect.top + rightRect.height / 2 - parentRect.top;

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", "#b97df2");
      line.setAttribute("stroke-width", "2");
      svg.appendChild(line);

      console.log("Drawing line from", from, "to", to, leftEl, rightEl);
    });
  }, [matches]);

  return (
    <div
      className="table-container"
      ref={containerRef}
      style={{ position: "relative" }}
    >
      <Typography variant="h6">Step 3: Match Columns</Typography>
      <svg
        id="line-overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "2rem",
          marginTop: "2rem",
          alignItems: "flex-start",
          zIndex: 1,
        }}
      >
        {/* Left: Recognized Columns */}
        <div style={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            style={{ color: "#cfa9ff", marginBottom: "0.75rem" }}
          >
            Recognized Columns (AI)
          </Typography>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {detectedHeaders.map((col, i) => (
              <li
                key={i}
                id={`left-${cleanColumn(col)}`}
                style={{
                  background: "#1c1c1c",
                  color: "#b97df2",
                  padding: "0.5rem 1rem",
                  marginBottom: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #3e3e3e",
                }}
              >
                {col}
              </li>
            ))}
          </ul>
        </div>

        {/* Center Label */}
        <div
          style={{
            width: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777",
            fontStyle: "italic",
            fontSize: "0.85rem",
          }}
        >
          Connections
        </div>

        {/* Right: Cleaned Columns */}
        <div style={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            style={{ color: "#cfa9ff", marginBottom: "0.75rem" }}
          >
            Cleaned Columns (User)
          </Typography>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {cleanedColumns.map((col, i) => (
              <li
                key={i}
                id={`right-${cleanColumn(col)}`}
                style={{
                  background: "#1c1c1c",
                  color: "#b97df2",
                  padding: "0.5rem 1rem",
                  marginBottom: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #3e3e3e",
                }}
              >
                {col}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MatchColumns;
