import React from "react";
import backgroundImage from "./assets/pic01.jpg";
import "./landingpage.css";

export default function LandingPage() {
  return (
    <div id="page-wrapper">
      <section
        id="banner"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "4em",
          textAlign: "center",
          color: "white",
        }}
      >
        <h2>Welcome to Xcellent</h2>
        <p>Your AI-powered Excel-to-database tool</p>
        <ul className="actions special">
          <li>
            <a
              href="/upload"
              style={{
                backgroundColor: "#3f51b5",
                padding: "1em 2em",
                borderRadius: "5px",
                textDecoration: "none",
                color: "white",
              }}
            >
              Get Started
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
