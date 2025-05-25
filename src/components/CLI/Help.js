import React from "react";
import "./Help.css";

function Help() {
    return (
        <div className="help-container">
            <pre className="help-text">
                {`    ────────────────────────────────────────────────────────────
                       BLACK SPIDER CLI - HELP                      
    ────────────────────────────────────────────────────────────

    Welcome to the Black Spider CLI, a tool designed 
    to analyze website security in a simple 
    yet effective way. Below you'll find the list of available commands 
    and some helpful tips to interpret errors and 
    get the most out of this application.

    ───────────────────────────────
    ● Available Commands:
    ───────────────────────────────

    > start scan <attack type> <url>
     Starts a scan of the specified website. Checks for 
     common vulnerabilities such as Cross-Site Scripting (XSS), 
     SQL Injection, misconfigured CORS, unprotected routes, 
     or open server ports. Be sure to include the protocol 
     (http:// or https://) to avoid errors.
     Currently available attack types:
         *cross site scripting -> xss
         *sql injection       -> sql
 
    > help
     Displays this detailed guide with all commands and most frequent errors.

    > more about me
     Shows technical and general information about the project 
     and the purpose of the tool.

    > clear me /or/ cls me
     Clears the current terminal output, leaving the CLI clean.
    
    > graphics
     Launches the GUI. Click on 'BLACK_SPIDER' to return to CLI mode.
    ───────────────────────────────
    ● Error Codes:
    ───────────────────────────────

    [ERR0R101] Syntax error
     └─▶ You may have mistyped the command; try again after checking 
         the "Available Commands" section.

    [ERR0R102] Keyword order issue
     └─▶ You may have used the wrong keyword order; try again after 
         reviewing the "Available Commands" section.

    [ERR0R103] Unknown command
     └─▶ It might be a valid combination, but it hasn't been implemented yet.

    [ERR0R104] Scan interrupted
     └─▶ The URL format is incorrect. Use: https://example.com

    [ERR0R105] Invalid color
     └─▶ The color combination does not exist.
         The color attribute is made of TWO hexadecimal digits: the 
         first for the background, the second for the foreground color.
         You can choose from the following values:
                0 = Black            8 = Gray
                1 = Dark Blue        9 = Blue
                2 = Green            a = Lime Green
                3 = Aqua             b = Light Blue
                4 = Burgundy         c = Red
                5 = Purple           d = Fuchsia
                6 = Olive Green      e = Yellow
                7 = Light Gray       f = White
  
    ───────────────────────────────
    ● Useful Tips:
    ───────────────────────────────

     └─▶ You can type: start scan <attack> https://site.com to launch a targeted scan.
     └─▶ Use cls me or clear me to quickly clean the screen without refreshing the page.
     └─▶ The color "combination" command remembers your preferences, 
         so the color setting will persist on future visits.
     └─▶ more about me reveals additional details about the CLI.
     └─▶ You can browse previous commands using the ↑/↓ arrow key.
     └─▶ Remember to include https:// when typing a URL (otherwise it won't be valid).
     └─▶ Error codes (e.g., 101, 104) indicate specific problems: check the legend or 
         correct the command.
     └─▶ Input focus is maintained automatically, so you can type without clicking.
     
    ───────────────────────────────
    ● Security Guidelines:
    ───────────────────────────────
     └─▶ Always validate and sanitize user input on both client and server sides
     └─▶ Implement proper Content Security Policy (CSP) headers
     └─▶ Use HTTPS for all communications and set appropriate security headers
     └─▶ Keep all software and libraries updated to their latest secure versions
     └─▶ Implement proper authentication and authorization controls
     └─▶ Use parameterized queries to prevent SQL injection attacks
     └─▶ Regularly scan for vulnerabilities and perform security audits
     └─▶ Follow the principle of least privilege for all system access
    ────────────────────────────────────────────────────────────
    ● For more information, run 'more about me'.
    ──────────────────────────────────────────────────────────── `}
            </pre>
        </div>
    )
}

export default Help