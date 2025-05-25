import React from "react";
import "./Scan.css";

function Scan({ message, url, vulnerabilities, vulnerableParameters, vulnerableCategories, attacco }) {
    function decodeHtmlEntities(str) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
    }


    return (
    <div className="scan-container">
        <pre className="scan-text">
        {`> Scanning URL: ${url}
> Scan Type: ${attacco}
> Status: ${vulnerabilities ? 'VULNERABLE' : 'NOT VULNERABLE'}
> Message: ${message}

> Detected Vulnerabilities:`}
        {'\n'}
        {vulnerabilities?.map((subArray, i) =>
            (Array.isArray(subArray) ? subArray : [subArray]).map((vuln, j) =>
                `  [${i + 1}.${j + 1}] ${decodeHtmlEntities(vuln.payload || vuln)}\n`
            )
        )
}
        {vulnerabilities?.length ? '' : "  No vulnerabilities found.\n"}

        {`\n> Vulnerable Parameters:`}
        {'\n'}
        {vulnerableParameters?.map(p => `  - ${p}\n`) || '  None\n'}

        {`\n> Vulnerable Categories:`}
        {'\n'}
        {vulnerableCategories?.map(c => `  * ${c}\n`) || '  None\n'}
        </pre>
    </div>
    );
}


export default Scan;
