import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Support.css";

function Support() {
  const [blinkIndicator, setBlinkIndicator] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkIndicator(prev => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setScanProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 80);
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="support-container">
      <header className="support-header">
        <h1>BLACK SPIDER v1.0.0</h1>
      </header>

      <section className="support-panel">
        <h2 className="section-title">Security Dashboard</h2>
        <p className="section-description">
          Analyze and monitor vulnerabilities in your website.
        </p>

        <h3 className="subsection-title">Scan Modules</h3>
        <ul className="list">
          <li><strong>XSS:</strong> identifies vulnerabilities in user parameters.</li>
          <li><strong>SQL Injection:</strong> detects attempts to manipulate the database.</li>
        </ul>

        <h3 className="subsection-title">Risk Levels</h3>
        <ul className="list">
          <li><strong>Critical:</strong> severe vulnerabilities.</li>
          <li><strong>High:</strong> should be resolved urgently.</li>
          <li><strong>Medium:</strong> potential risk.</li>
          <li><strong>Low:</strong> recommendations for improvement.</li>
        </ul>

        <h3 className="subsection-title">Basic Security Tips</h3>
        <ul className="list">
          <li>Always sanitize user input.</li>
          <li>Enable HTTPS everywhere.</li>
          <li>Use parameterized queries.</li>
          <li>Apply the principle of least privilege.</li>
        </ul>

        <h3 className="subsection-title">Advanced Recommendations</h3>
        <ul className="list">
          <li>Implement Content Security Policy (CSP).</li>
          <li>Isolate services using containers (e.g., Docker).</li>
          <li>Monitor logs with automated tools (SIEM).</li>
          <li>Use two-factor authentication (2FA) for admin access.</li>
        </ul>

        <h3 className="subsection-title">Security Highlights</h3>
        <ul className="list">
          <li style={{ color: blinkIndicator ? "#ff6666" : "#00ffcc" }}>
            Never trust **user input**!
          </li>
          <li style={{ color: blinkIndicator ? "#00ffcc" : "#ffcc00" }}>
            Always keep your dependencies up to date.
          </li>
        </ul>

        <button className="support-button" onClick={() => navigate("/graphics")}>
          Go to Graphic Dashboard
        </button>
      </section>
    </div>
  );
}

export default Support;
