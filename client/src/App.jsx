import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FacebookLogin from "./components/FbLogin";
import Home from "./components/Home";
import PageDetails from "./components/PageDetails";
function App() {
  
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element = {<FacebookLogin/>}/>
        <Route path="/home" element = {<Home/>}/>
        <Route path="/page/:pageId" element={<PageDetails />} />
      </Routes>
      </BrowserRouter>
      </div>
  );
}

export default App;