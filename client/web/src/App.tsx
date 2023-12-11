import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/LoginPage";
import RecoveryPage from "./pages/RecoveryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/RecuperarSenha" element={<RecoveryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
