import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from "./components/Main";
import MainV from "./components/MainV"
import Support from "./components/VISUAL/Support";
import Identity from "./components/VISUAL/Identity";

function App() {
    
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/graphics" element={<MainV newSfondo={"newSfondo"}/>}/>
                <Route path="/identity" element={<Identity />} />
                <Route path="/support" element={<Support/>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
