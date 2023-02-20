import { useEffect } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    function storageChange(event: StorageEvent) {
      if (event.key === "logged_out") {
        navigate("/login");
      } else {
        navigate("/dashboard");
      }
    }
    window.addEventListener("storage", storageChange, false);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Login />}></Route>
    </Routes>
  );
}

export default App;
