import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Analytics from "./pages/Analytics";

function App() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark-mode" : ""}>
      <button 
        onClick={() => setDark(!dark)} 
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        Toggle Dark Mode
      </button>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;