import React, { useEffect, useState } from "react";
import "./Results.css";

function Results({ scanResults, URL }) {
  const [displayStage, setDisplayStage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size on component mount and window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Reset del display quando arrivano nuovi risultati
  useEffect(() => {
    if (scanResults) {
      setDisplayStage(0);
      const timer = setTimeout(() => {
        setDisplayStage(1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [scanResults]);

  // Avanza gradualmente nella visualizzazione dei risultati
  useEffect(() => {
    if (scanResults && displayStage > 0 && displayStage < 4) {
      const timer = setTimeout(() => {
        setDisplayStage(prevStage => prevStage + 1);
      }, isMobile ? 600 : 800); // Slightly faster on mobile

      return () => clearTimeout(timer);
    }
  }, [displayStage, scanResults, isMobile]);

  // Se non ci sono risultati, mostra un terminale in attesa
  if (!scanResults) {
    return (
      <div className="results-container custom-scrollbar-container">
        <div className="results-terminal">
          <div className="results-header">
            <div className="results-glitch-text" data-text="SCAN RESULTS">SCAN RESULTS</div>
            <div className="results-controls">
              <span className="results-button"></span>
              <span className="results-button"></span>
              <span className="results-button"></span>
            </div>
          </div>
          <div className="results-content">
            <div className="results-scan-line"></div>
            <div className="results-message">
              <div className="results-status-icon results-waiting">?</div>
              <span>AWAITING SCAN INITIALIZATION...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { url, message, vulnerabilities = [], vulnerableParameters = [], vulnerableCategories = [] } = scanResults;
  const isVulnerable = message.includes("is vulnerable");

  return (
    <div className="results-container">
      <div className="results-terminal">
        <div className="results-header">
          <div className="results-glitch-text" data-text="SCAN RESULTS">SCAN RESULTS</div>
          <div className="results-controls">
            <span className="results-button"></span>
            <span className="results-button"></span>
            <span className="results-button"></span>
          </div>
        </div>

        <div className="results-content">
          <div className="results-scan-line"></div>
          
          {/* Stato iniziale - Analisi in corso */}
          {displayStage === 0 && (
            <div className="results-processing-container">
              <div className="results-processing-text">PROCESSING SCAN DATA</div>
              <div className="results-processing-dots">
                <span className="results-dot">.</span>
                <span className="results-dot">.</span>
                <span className="results-dot">.</span>
              </div>
              <div className="results-processing-progress">
                <div className="results-progress-bar"></div>
              </div>
            </div>
          )}
          
          {/* Stato 1 - Riepilogo dei risultati */}
          {displayStage >= 1 && (
            <div className="results-summary">
              <div className="results-scan-header">
                <div className="results-title">VULNERABILITY SCAN COMPLETE</div>
                <div className="results-timestamp">{new Date().toISOString()}</div>
              </div>
              
              <div className={`results-status-indicator ${isVulnerable ? 'results-vulnerable' : 'results-secure'}`}>
                <div className="results-status-icon">{isVulnerable ? '!' : '✓'}</div>
                <div className="results-status-text">{isVulnerable ? 'VULNERABLE' : 'SECURE'}</div>
              </div>
              
              <div className="results-target-url">
                <div className="results-label">TARGET URL:</div>
                <div className="results-url-display">{URL}</div>
              </div>
              
              <div className="results-message-text">
                {message}
              </div>
            </div>
          )}
          
          {/* Stato 2 - Parametri e categorie (se vulnerabile) */}
          {displayStage >= 2 && isVulnerable && (
            <div className="results-parameters-section">
              {/* Sezione parametri vulnerabili */}
              <div className="results-section-block">
                <div className="results-section-title">
                  <div className="results-section-icon">&gt;</div>
                  {isMobile ? "VULN PARAMS" : "VULNERABLE PARAMETERS"}
                </div>
                <div className="results-parameters-list">
                  {vulnerableParameters.length > 0 ? (
                    vulnerableParameters.map((param, index) => (
                      <div key={index} className="results-parameter-item">
                        <span className="results-param-name">{param}</span>
                      </div>
                    ))
                  ) : (
                    <div className="results-no-data">NO SPECIFIC PARAMETERS IDENTIFIED</div>
                  )}
                </div>
              </div>
              
              {/* Separatore con effetto glitch */}
              <div className="results-separator">
                <div className="results-separator-line"></div>
                <div className="results-separator-glitch"></div>
              </div>
              
              {/* Sezione categorie vulnerabili */}
              <div className="results-section-block">
                <div className="results-section-title">
                  <div className="results-section-icon">&gt;</div>
                  {isMobile ? "VULN CATEGORIES" : "VULNERABILITY CATEGORIES"}
                </div>
                <div className="results-categories-list">
                  {vulnerableCategories && vulnerableCategories.length > 0 ? (
                    vulnerableCategories.map((category, index) => (
                      <div key={index} className="results-category-item">
                        <span className="results-category-name">{category}</span>
                      </div>
                    ))
                  ) : (
                    <div className="results-no-data">NO CATEGORIES IDENTIFIED</div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Stato 3 - Dettagli completi (se vulnerabile) */}
          {displayStage >= 3 && isVulnerable && vulnerabilities.length > 0 && (
            <>
              {/* Separatore con effetto glitch */}
              <div className="results-separator">
                <div className="results-separator-line"></div>
                <div className="results-separator-glitch"></div>
              </div>
              
              <div className="results-vulnerabilities-section">
                <div className="results-section-title results-details-title">
                  <div className="results-section-icon">&gt;</div>
                  {isMobile ? "VULN DETAILS" : "DETAILED VULNERABILITY ANALYSIS"}
                </div>
                
                <div className="results-vulnerabilities-list">
                  {vulnerabilities.map((vuln, index) => (
                    <div key={index} className="results-vulnerability-item">
                      {vuln.payload && (
                        <div className="results-vuln-payload">
                          <div className="results-payload-label">PAYLOAD:</div>
                          <div className="results-payload-content">{vuln.payload}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default Results;