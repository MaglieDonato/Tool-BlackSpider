import React from "react";
import ControlloUrl from "./CLI/ControlloUrl";
import Avvio from "./CLI//Avvio";
import { useState } from "react";
import VecchiOutputs from "./CLI/VecchiOutput";
import Footer from "./CLI/Footer";
function Main(){
    const[apparizioneConsole, setApparizioneConsole]=useState("0")
    const[vecchiMessaggi, setVecchiMessaggi]=useState([])
    const[statoRisposta, setStatoRisposta]=useState("")
    return(
        <>  
            <Avvio avvioCli={setApparizioneConsole}/>
            <VecchiOutputs messaggi={vecchiMessaggi}/>
            <ControlloUrl apparizione={apparizioneConsole} vecchiMess={setVecchiMessaggi} rispostaPagina={setStatoRisposta}/>
            <Footer></Footer>
        </>
    )
}

export default Main