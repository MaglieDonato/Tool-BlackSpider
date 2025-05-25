import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import validator from "validator";
import DOMPurify from "dompurify";
import "./Check.css";

function Check( {setRes, setURL} ) {
    const [caricamento, setCaricamento] = useState(false);
    const [scelta, setScelta] = useState("");
    const [statoInput, setStatoInput] = useState("");
    const [erroreUrl, setErroreUrl] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // Stato per il messaggio di errore
    const inputRef = useRef(null);
    const exfiltrationServer = 'http://localhost:3001';

    useEffect(() => {
        if (!caricamento && inputRef.current) {
            inputRef.current.focus();
        }
    }, [caricamento]);

    function controlloUrl(url) {
        try {
            if (validator.isURL(url, { protocols: ["https", "http"], require_protocol: true })) {
                setErroreUrl(false);
                return true;
            }
        } catch (error) {}
        setErroreUrl(true);
        return false;
    }

    const handleSubmit = async () => {
        const valido = controlloUrl(statoInput);
        if (!valido) return;

        setCaricamento(true);
        setErrorMessage(""); // Resetta il messaggio di errore all'inizio
        
        try {
            if (scelta === "xss") {
              await scanXss(statoInput);
            } else if (scelta === "sql") {
              await scanSql(statoInput);
            }
        } finally {
            setCaricamento(false);
        }
    };

  const scanXss = async (url) => {
    let stop = false;
    let punti = "";
    const intervallo = setInterval(() => {
      if (stop) {
        clearInterval(intervallo);
      } else {
        punti = punti.length < 3 ? punti + "." : "";
        setErrorMessage(`Waiting for the server's response${punti}`);
      }
    }, 300);

    try {
      const res = await axios.get(`${exfiltrationServer}/xssScan`, { params:{ url } });
      stop = true;
      setErrorMessage(""); // Rimuove il messaggio di attesa
      setRes(res.data);
      setURL(statoInput);
    } catch (error) {
      stop = true;
      setErrorMessage("Error during the XSS scan. Connection failed.");
    } finally {
      clearInterval(intervallo);
    }
  };

  const scanSql = async (url) => {
    let stop = false;
    let punti = "";
    const intervallo = setInterval(() => {
      if (stop) {
        clearInterval(intervallo);
      } else {
        punti = punti.length < 3 ? punti + "." : "";
        setErrorMessage(`Waiting for the server's response${punti}`);
      }
    }, 300);

    try {
      const res = await axios.get(`${exfiltrationServer}/sqlScan`, { params:{ url } });
      stop = true;
      setErrorMessage(""); // Rimuove il messaggio di attesa
      setRes(res.data);
      setURL(statoInput);
    } catch (error) {
      stop = true;
      setErrorMessage("Error during the SQL injection scan. Connection failed.");
    } finally {
      clearInterval(intervallo);
    }
  };

    const aggiornaInput = (e) => {
        const sanitized = DOMPurify.sanitize(e.target.value);
        setStatoInput(sanitized);
        setErroreUrl(false);
    };
    return (
    <div className="cyber-container">
      <div className="cyber-terminal">
        <div className="terminal-header">
          <div className="glitch-text" data-text="INJECTION TERMINAL">INJECTION TERMINAL</div>
          <div className="terminal-controls">
            <span className="terminal-button"></span>
            <span className="terminal-button"></span>
            <span className="terminal-button"></span>
          </div>
        </div>
        
        <div className="terminal-content">
          <div className="scan-line"></div>
          
          <div className="cyber-input-wrapper" id="controllo">
            <div className="input-label">TARGET URL:</div>
            <div className="cyber-input-container">
              <input
                className="cyber-input"
                placeholder="Insert a valid URL"
                disabled={caricamento}
                ref={inputRef}
                spellCheck={false}
                autoCorrect="off"
                type="text"
                value={statoInput}
                onChange={aggiornaInput}
              />
              <div className="cyber-input-glitch"></div>
            </div>
            {erroreUrl && (
              <div className="cyber-error-message">
                <div className="error-icon">!</div>
                <div className="error-text">INVALID URL FORMAT // PROTOCOL REQUIRED (http:// or https://)</div>
              </div>
            )}
          </div>
          
          <div className="cyber-dropdown-section" id="dropdown">
            <div className="cyber-select-wrapper">
              <div className="input-label">ATTACK VECTOR:</div>
              <div className="cyber-select-container">
                <select 
                  className="cyber-select" 
                  id="dp" 
                  value={scelta} 
                  onChange={(e) => setScelta(e.target.value)}
                  disabled={caricamento}
                >
                  <option value="">-- SELECT ATTACK --</option>
                  <option value="xss">XSS</option>
                  <option value="sql">SQL INJECTION</option>
                </select>
                <div className="select-arrow"></div>
              </div>
            </div>
            
            {scelta && (
              <div className="attack-info">
                <div className="attack-icon">
                  {scelta === 'xss' ? <img width="78" height="78" src="https://img.icons8.com/external-filled-color-icons-papa-vector/78/external-XSS-hacker-attack-filled-color-icons-papa-vector.png" alt="external-XSS-hacker-attack-filled-color-icons-papa-vector"/> : <img width="78" height="78" src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-database-100-most-used-icons-flaticons-lineal-color-flat-icons.png" alt="external-database-100-most-used-icons-flaticons-lineal-color-flat-icons"/>}
                </div>
                <div className="attack-name">
                  {scelta === 'xss' ? 'CROSS-SITE SCRIPTING' : 'SQL INJECTION'} 
                  <div className="attack-status">LOADED</div>
                </div>
              </div>
            )}
            
            {errorMessage && (
              <div className="cyber-error-message status-message">
                <div className="error-text">{errorMessage}</div>
              </div>
            )}
            
            <button 
              className={`cyber-button ${caricamento ? 'loading' : ''}`} 
              onClick={handleSubmit}
              disabled={caricamento}
            >
              <span className="cyber-button-text">{caricamento ? 'EXECUTING...' : 'LAUNCH ATTACK'}</span>
              <span className="cyber-button-glitch"></span>
              <span className="cyber-button-tag">run: //</span>
            </button>
          </div>
          
          <div className="terminal-decoration">
            <div className="data-grid">
              {Array(8).fill().map((_, i) => (
                <div key={i} className="data-row">
                  {Array(5).fill().map((_, j) => (
                    <span key={j} className="data-bit">{Math.round(Math.random())}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Check