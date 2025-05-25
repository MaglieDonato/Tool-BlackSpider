import React, { useState, useEffect } from "react";
import Header from "./VISUAL/Header";
import Check from "./VISUAL/Check";
import Results from "./VISUAL/Results";
import "./MainV.css"
import Footer from "./CLI/Footer"
function MainV({newSfondo}){
    const [risultati, setRisultati] = useState(null)
    const [url, setURL] = useState(null)
    const [isMobile, setIsMobile] = useState(false)
    
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
    
    return(
        <>  
            <div className={newSfondo}>
            <Header />
            <div id="contenitore">
                <Check setRes={setRisultati} setURL={setURL} />
                <Results scanResults={risultati} URL={url} />
            </div>
            <Footer className="footer-dark" />
            </div>
        </>
    )
}   

export default MainV