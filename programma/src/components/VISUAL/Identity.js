import React from "react";
import { useNavigate } from "react-router-dom";
import "./Identity.css";

function Identity() {
  const navigate = useNavigate();

  return (
    <div className="identity-container">
      <header className="identity-header">
        <h1>BLACK SPIDER 1.0.0</h1>
      </header>

      <section className="identity-panel">
        <p className="identity-description">
          <strong>Black Spider</strong> is a graphical interface designed to perform web security analysis in a clear and interactive way.
          The tool uses a combination of automated scripts and scanning techniques based on offensive cybersecurity principles.
        </p>

        <h3 className="identity-section-title">▸ WHAT IT DOES</h3>
        <ul className="identity-list">
          <li>Scans URLs to detect common vulnerabilities like:</li>
          <li>Cross-Site Scripting (XSS)</li>
          <li>SQL Injection</li>
        </ul>

        <h3 className="identity-section-title">▸ HOW IT WORKS</h3>
        <ul className="identity-list">
          <li>Enter a valid URL in the input field and confirm.</li>
          <li>The system launches predefined modules to send HTTP requests and analyze responses.</li>
          <li>Results appear in an intuitive dashboard with color-coded risk levels.</li>
        </ul>

        <h3 className="identity-section-title">▸ IN CASE OF ERROR</h3>
        <ul className="identity-list">
          <li>If something goes wrong (e.g., invalid URL or scan failure), an alert will inform the user of the issue.</li>
          <li>A help section is available to guide users through all available options and modules.</li>
        </ul>

        <h3 className="identity-section-title">▸ IMPORTANT NOTES</h3>
        <ul className="identity-list">
          <li>This tool is designed for educational and testing purposes only.</li>
          <li>Only use it on websites you own or have explicit permission to analyze.</li>
          <li>No real exploits are performed – only passive and safe vulnerability analysis is conducted.</li>
        </ul>

        <button className="identity-button" onClick={() => navigate("/graphics")}>
          Go to Graphical Dashboard
        </button>
      </section>
    </div>
  );
}

export default Identity;
