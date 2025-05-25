import React from "react";
import "./MoreAboutMe.css";

function MoreAboutMe() {
    return (
        <div className="more-about-container">
            <pre className="more-about-text">
                {`  Black Spider is a simulated CLI interface designed to perform  
  web security analysis. The tool uses a combination of automated scripts  
  and scanning techniques based on offensive cybersecurity principles.

  ▸ WHAT IT DOES
    - Analyzes entered URLs to detect common vulnerabilities such as:
        * Cross-Site Scripting (XSS)
        * SQL Injection
    - Simulates a penetration tester's behavior, reporting issues  
      directly in the terminal-style interface.
  
  ▸ HOW IT WORKS
    - Enter a valid URL and press Enter.
    - The system triggers pre-configured tools and scripts to perform  
      HTTP requests and analyze the responses.
    - Results are displayed directly in the console.
  
  ▸ IN CASE OF ERROR
    - If something goes wrong (e.g., invalid URL or unknown command),  
      the system will return an error message.
    - Use the 'help' command to get a list of available commands  
      and instructions on how to use them properly.
  
  ▸ IMPORTANT NOTES
    - This tool is intended for educational and testing purposes only.
    - Use it only on websites you own or have explicit permission to test.
    - It does not perform real exploits: it only conducts passive analysis  
      and safe simulations.
  System ready. Type a command or write 'help' to begin.
`}
            </pre>
        </div>
    )
}

export default MoreAboutMe; 