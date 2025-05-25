//useRef viene usato per tenere il riferimento su un componente. 
//nel mio caso lo utilizzo per mantenere il focus sul componente input.
//è molto più comodo anzicchè usare una variabile come in js normale.
import React, { useEffect, useState, useRef,  } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import DOMPurify from "dompurify";
import axios from "axios";
import "./ControlloUrl.css";
import MoreAboutMe from "./MoreAboutMe";
import Help from "./Help";
import Scan from "./Scan";
const ControlloUrl = ({apparizione, vecchiMess, rispostaPagina}) => {
  const [comando, setComando] = useState("");
  const [statoI, setStatoI] = useState("acceso");
  const [errore, setErrore] = useState(false);
  const [statoBuffer, setStatoBuffer] = useState([]);
  const [cBuffer, setCBuffer] = useState(0);
  const [colore, setColore] = useState(() => {
    const salvato = localStorage.getItem("sfondo");
    return salvato ? JSON.parse(salvato) : ["0", "a"]; 
  });
  const navigate=useNavigate()
  const [caricamento, setCaricamento]=useState(false)
  const inputRef = useRef(null);
  const exfiltrationServer = 'http://localhost:3001';
  const aggiornaInput = (e) => {
    let sanitized = DOMPurify.sanitize(e.target.value);
    setComando(sanitized);
  };
  //comandi:
  //help
  //start scan XXX XXX 
  //more about me
  //cls me 
  //clear me
  //color
  //graphics
  const coloriConsole = {
    "0": "#000000", // Nero
    "1": "#000080", // Blu scuro
    "2": "#008000", // Verde
    "3": "#00FFFF", // Verde acqua (cyan)
    "4": "#800000", // Bordeaux
    "5": "#800080", // Viola
    "6": "#808000", // Verde oliva
    "7": "#D3D3D3", // Grigio chiaro
    "8": "#808080", // Grigio
    "9": "#0000FF", // Blu
    "a": "#00FF00", // Verde limone
    "b": "#00BFFF", // Azzurro
    "c": "#FF0000", // Rosso
    "d": "#FF00FF", // Fucsia
    "e": "#FFFF00", // Giallo
    "f": "#FFFFFF"  // Bianco
  };

  const comandiCLI = {
    "help": 1, "-h": 1,
    "cls": 3, "clear": 3,
    "start": 0,
    "scan": 2, "-s": 2,
    "stop": 5,
    "more": 4,
    "about": 6,
    "me": 7,
    "color":10,
    "graphics":25
  };

  const ordineComandi = [
    [1],
    [3, 7],
    [0, 2, 20, 21],
    [4, 6, 7],
    [10,30],
    [25]
  ];
  let attaccoAttuale=""
  let URL=""
  const attacchiConsentiti = ["xss", "sql"];

  function verificaComando(comandoStr, cBuffer, coloriConsole) {
    let listaComandi = comandoStr.trim().split(" ");
    //array per controllare che la sequenza dei comandi sia corretta
    let sequenzaUtente = [];
    let tipoAttacco = null;
    let url = null;

    for (let i = 0; i < listaComandi.length; i++) {
      const cmd = listaComandi[i].toLowerCase();

      if (cmd in comandiCLI) {
        sequenzaUtente.push(comandiCLI[cmd]);
      } else if (i === 2 && listaComandi[0] === "start" && listaComandi[1] === "scan") {
        let risultatoAzione = controlloAzioni(cmd);
        if (risultatoAzione !== 200) return 103;
        tipoAttacco = cmd;
        sequenzaUtente.push(20);
      } else if (i === 3 && listaComandi[0] === "start" && listaComandi[1] === "scan") {
        let risultatoUrl = controlloUrl(cmd);
        if (risultatoUrl !== 200) return 104;
        url = cmd;
        sequenzaUtente.push(21);
      } else if(listaComandi[0]=="color"){
        let controlloC=controlloColore(listaComandi[1], coloriConsole)
        if(controlloC!== 200)return 105
        sequenzaUtente.push(30)
      } else if(listaComandi[0]=="graphics"){
        sequenzaUtente.push(25)
      }else{
        return 101;
      }
    }

    for (let sequenzaCorretta of ordineComandi) {
      if (sequenzaCorretta.length !== sequenzaUtente.length) continue;
      let match = true;
      for (let i = 0; i < sequenzaUtente.length; i++) {
        if (sequenzaUtente[i] !== sequenzaCorretta[i]) {
          match = false;
          break;
        }
      }
      if (match) {
        return (200 + sequenzaCorretta[0]);
      }
    }

    return 102;
  }

  function controlloAzioni(tipo) {
    tipo = tipo.toLowerCase();
    attaccoAttuale=tipo
    return attacchiConsentiti.includes(tipo) ? 200 : 103;
  }

  function controlloUrl(url) {
    try {
      if (validator.isURL(url, { protocols: ["https", "http"], require_protocol: true })) {
        URL=url
        return 200;
      }
    } catch (error) {
    }
    return 104;
  }

  function controlloColore(c, coloriConsole) {
    if (c.length !== 2) {
      // Se la stringa non ha esattamente 2 caratteri, restituisci errore
      return 105;
    }
  
    let serie = c.split("");
    // Verifica se entrambi i caratteri esistono come proprietà in coloriConsole
    if (coloriConsole.hasOwnProperty(serie[0]) && coloriConsole.hasOwnProperty(serie[1])) {
      setColore(serie)
      return 200;  // Successo
    } else {
      return 105;  // Colore non valido
    }
  }
  

  //funzioni vere e proprie
  function help() {
    vecchiMess(prev => [...prev, <Help key={prev.length}/>]);
  }

  function cleanScreen() {
    vecchiMess([])
  }
  //useref mantiene un puntatore persistente
  const xss = async (url) => {
  let stop = false;
  let punti = "";
  let messaggioId = null; 
  const intervallo = setInterval(() => {
    if (stop) {
      clearInterval(intervallo);
    } else {
      setCaricamento(true)
      punti = punti.length < 3 ? punti + "." : "";
      vecchiMess(prev => {
        const nuovoMessaggio = `Waiting for the server's response${punti}`;
        if (messaggioId === null) {
          messaggioId = prev.length;
          return [...prev, nuovoMessaggio];
        } else {
          const copia = [...prev];
          copia[messaggioId] = nuovoMessaggio;
          return copia;
        }
      });
    }
  }, 300);

  try {
    const risposta = await axios.get(`${exfiltrationServer}/xssScan`, {
      params: { url }
    });

    stop = true;

    setCaricamento(false)
    // Dopo aver ricevuto la risposta, rimpiazziamo il messaggio di attesa
    vecchiMess(prev => {
      const copia = [...prev];
      if (messaggioId !== null) {
        copia[messaggioId] = <Scan key={messaggioId} {...risposta.data} attacco="XSS" />;
        return copia;
      }
      // Se qualcosa è andato storto e il messaggio non è mai stato aggiunto
      return [...prev, <Scan key={prev.length} {...risposta.data} attacco="XSS" />];
    });
  } catch (error) {
    stop = true;
    setCaricamento(false)
    vecchiMess(prev => [...prev, "Error during the XSS scan."]);
  }
};


  
const sql = async (url) => {
  let stop = false;
  let punti = "";
  let messaggioId = null;

  const intervallo = setInterval(() => {
    if (stop) {
      clearInterval(intervallo);
    } else {
      setCaricamento(true);
      punti = punti.length < 3 ? punti + "." : "";
      vecchiMess(prev => {
        const nuovoMessaggio = `Waiting for the server's response${punti}`;
        if (messaggioId === null) {
          messaggioId = prev.length;
          return [...prev, nuovoMessaggio];
        } else {
          const copia = [...prev];
          copia[messaggioId] = nuovoMessaggio;
          return copia;
        }
      });
    }
  }, 300);

  try {
    const risposta = await axios.get(`${exfiltrationServer}/sqlScan`, {
      params: { url }
    });

    stop = true;
    setCaricamento(false);

    vecchiMess(prev => {
      const copia = [...prev];
      if (messaggioId !== null) {
        copia[messaggioId] = <Scan key={messaggioId} {...risposta.data} attacco="SQL Injection" />;
        return copia;
      }
      return [...prev, <Scan key={prev.length} {...risposta.data} attacco="SQL Injection" />];
    });

  } catch (error) {
    stop = true;
    setCaricamento(false);
    vecchiMess(prev => [...prev, "Error during the SQL Injection scan."]);
  }
};


  
  function scansione(tipo, url) {
    switch(tipo){
      case "xss": 
                xss(url)
                break
      case "sql":
                sql(url)
                break
      default:
              vecchiMess(prev => [...prev, `This type of attack has not been implemented yet.
`]);
    }             
  }

  function moreAboutMe() {
    // //prev è una variabile locale che rappresenta lo stato di vecchiMessaggi
    vecchiMess(prev => [...prev, <MoreAboutMe key={prev.length} />]);
  }
  useEffect(() => {
    localStorage.setItem("sfondo", JSON.stringify(colore));
    document.body.style.backgroundColor = coloriConsole[colore[0]];
    document.body.style.color = coloriConsole[colore[1]];
  }, [colore]);
  
  
  function cambiaColore(comandoOriginale){
    vecchiMess(prev => [...prev, `Color updated:${comandoOriginale.split(" ")[1]}`]);
  }

  //gestione funzionalità
  function iniziaAzione(codice, comandoOriginale) {
    vecchiMess(prev => [...prev, comandoOriginale]);
    switch (codice) {
      case 201: 
              help(); 
              break;
      case 203: 
              cleanScreen();
              break;
      case 200: 
              scansione(attaccoAttuale, URL); 
              break;
      case 204: 
              moreAboutMe(); 
              break;
      case 210: 
              cambiaColore(comandoOriginale);
              break;
      case 225:
              navigate("/graphics")
              break
      default: 
              vecchiMess(prev => [...prev, `Invalid input: (${codice})`])
    }
  }

  //gestione errori
  function gestisciErrore(output) {
    switch (output) {
      case 105:
                vecchiMess(prev => [...prev, `ERROR 105! The color combination you entered is not valid. Check the valid combinations using the help command.`]);
                break
      case 104: 
                vecchiMess(prev => [...prev, `ERROR 104! The URL is not valid.`]);
                break
      case 103: 
                vecchiMess(prev => [...prev, `ERROR 103! Action not allowed. Use the help command to see the allowed actions.`]);
                break
      case 102: 
                vecchiMess(prev => [...prev, `ERROR 102! You used the wrong command order. Use the help command to check the correct order.`]);
                break
      case 101: 
                vecchiMess(prev => [...prev, `ERROR 101! Syntax error. Make sure you write the commands correctly.`]);
                break
      default: vecchiMess(prev => [...prev, `ERROR!`]);
    }
}


  //gestione per inserire i vecchi comandi
  function caricaStorico(e) {
    
    if(e.key==="ArrowDown"){
      if (cBuffer < statoBuffer.length - 1) {
        const nuovoIndice = cBuffer + 1;
        setCBuffer(nuovoIndice);
        setComando(statoBuffer[nuovoIndice]);
      }
    }

    if(e.key==="ArrowUp"){
      if (cBuffer > 0) {
      const nuovoIndice = cBuffer - 1;
      setCBuffer(nuovoIndice);
      setComando(statoBuffer[nuovoIndice]);
    }
    }
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.selectionStart = inputRef.current.selectionEnd = inputRef.current.value.length;
      }
    }, 0);
  }
  //gestione linea di input
  useEffect(()=>{
    if (apparizione !== 0) {
      inputRef.current?.focus();
    }
  }, [apparizione])
   useEffect(() => {
    const handleClick = (e) => {
  if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
    return; // non applicare il focus
  }
  inputRef.current?.focus();
};
    // Aggiunge l'evento click globale
    window.addEventListener('click', handleClick);

    // Pulisce l'evento quando il componente si smonta
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);
  useEffect(() => {
    inputRef.current?.focus();
    let intervallo;
    if (comando === "") {
      intervallo = setInterval(() => {
        setStatoI((prev) => (prev === "acceso" ? "spento" : "acceso"));
      }, 500);
    } else {
      setStatoI("spento");
    }
    return () => clearInterval(intervallo);
  }, [comando]);
  

  // è utile se si deve lavorare direttamente con l'html
  useEffect(()=>{
    if(!caricamento && inputRef.current){ //controlla che ci sia il riferimento
      inputRef.current.focus(); // punta al componente
    }
  }, [caricamento])

  //componente
  return (
    <>
      {apparizione==0?null:(<form id="blackspider" >
      <label id="parolaI">./blackspider{">"}</label>
      <div 
        className={`segnoInput ${statoI}`}
        style={{
          backgroundColor: coloriConsole[colore[1]],
        }}
      ></div>
        <input
        style={{
          backgroundColor: coloriConsole[colore[0]],
          color: coloriConsole[colore[1]]
        }}
        onClick={() => {
          inputRef.current?.focus();
        }}
          disabled={caricamento}
          ref={inputRef}
          spellCheck={false}
          autoCorrect="off"
          className="inputCLI"
          value={comando}
          onChange={aggiornaInput}
          type="text"
          //burattinaio della cli
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // per sicurezza
              if (comando.trim() !== "") {
                setStatoBuffer(prev => [...prev, comando]);
                setCBuffer(statoBuffer.length + 1);
              }
          
              const output = verificaComando(comando, cBuffer, coloriConsole);
          
              if (output < 200) {
                vecchiMess(prev => [...prev, comando]);
                gestisciErrore(output);
              } else {
                iniziaAzione(output, comando.toLowerCase());
              }
              
          
              setComando("");
            }
          
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              caricaStorico(e);
            }

          }}
        />
      </form>)}
    </>
  );
};

export default ControlloUrl;
