import React, { useState } from "react";
import FacebookLogin from "./components/FbLogin";
function App() {
  const [profile, setProfile] = useState(null);
  const [accessToken,setAccessToken]=useState("");
  return (
    <div>
      Login
      <FacebookLogin/>
      </div>
  );
}

export default App;