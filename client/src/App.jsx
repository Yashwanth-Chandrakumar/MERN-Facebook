import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FacebookLogin from "./components/FbLogin";
import Home from "./components/Home";
function App() {
  
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element = {<FacebookLogin/>}/>
        <Route path="/home" element = {<Home/>}/>
      </Routes>
      </BrowserRouter>
      </div>
  );
}

export default App;