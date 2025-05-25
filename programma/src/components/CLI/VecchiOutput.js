import React from "react";
import "./VecchiOutput.css";

function VecchiOutputs({ messaggi }) {
    return (
      <>
        {messaggi.map((c, i) =>
          typeof c === "string" ? (
            <div key={i}>
              {/* renderizza la stringa */}
              <pre className="vecchiM">./blackspider {">"} {c}</pre>
            </div>
          ) : (
            //renderizza il componente
            <div key={i}>
              <div >{c}</div> 
            </div>
          )
        )}
      </>
    );
  }
  
  export default VecchiOutputs;
  