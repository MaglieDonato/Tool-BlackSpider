import { useState, useEffect } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate=useNavigate()
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    // Occasionally trigger glitch effect
    const glitchTimer = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 200);
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(glitchTimer);
    };
  }, []);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  return (
    <div className={`header-container ${glitchEffect ? 'glitch-effect' : ''}`}>
      {/* Main Header Bar */}
      <div className="header-main">
        {/* Digital noise background */}
        <div className="digital-noise">
          {Array(20).fill().map((_, i) => (
            <div 
              key={i}
              className="noise-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 10}px`,
                height: `${Math.random() * 10}px`,
                opacity: Math.random() * 0.5
              }}
            />
          ))}
        </div>
        
        {/* Logo Section */}
        <div className="logo-section">
          <div onClick={() => navigate("/")} style={{ cursor: "pointer" }} className={`logo-text ${glitchEffect ? 'text-glitch' : ''}`}>
            <span>
              BL<span className="accent-letter">A</span>CK_SPIDER
            </span>
          </div>
          
          <div className="logo-icon">
            <svg viewBox="0 0 64 64" className="logo-svg">
              <path d="M32 8C17.6 8 6 19.6 6 34c0 14.4 11.6 26 26 26s26-11.6 26-26c0-14.4-11.6-26-26-26zm0 4c12.15 0 22 9.85 22 22 0 12.15-9.85 22-22 22-12.15 0-22-9.85-22-22 0-12.15 9.85-22 22-22z"/>
              <circle cx="32" cy="34" r="6"/>
              <path d="M32 40v16M32 12v16M26 18l-8-8M38 18l8-8M26 50l-8 8M38 50l8 8M12 28H6M18 16l-8-4M58 28h-6M46 16l8-4M18 52l-8 4M46 52l8 4"/>
            </svg>
            <div className="status-indicator"></div>
          </div>
        </div>

        <div className="nav-section">
          <div className="system-status">
            <div className="status-item">
              <span className="status-label">SYS_STATUS</span>
              <span className="status-value">SECURED</span>
            </div>
            <div className="status-item">
              <span className="status-label">UPTIME</span>
              <span className="status-value time-value">{time}</span>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="nav-items">
              <div onClick={()=>navigate("/identity")} className="nav-item">
                <div className="nav-button">
                  <span className="bracket">[</span>
                  IDENTITY
                  <span className="bracket">]</span>
                </div>
                <div className="hover-line"></div>
                <div className="hover-border"></div>
              </div>

              <div onClick={()=>navigate("/support")} className="nav-item">
                <div className="nav-button">
                  <span className="bracket">[</span>
                  SUPPORT
                  <span className="bracket">]</span>
                </div>
                <div className="hover-line"></div>
                <div className="hover-border"></div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;

