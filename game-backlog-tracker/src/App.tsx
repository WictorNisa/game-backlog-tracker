import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav.tsx";
import HeroPage from "./components/HeroPage/HeroPage.tsx";
import Auth from "./routes/Auth/Auth.tsx";
import Home from "./routes/Home/Home.tsx";
import PrivateRoute from "./routes/PrivateRoute.tsx";
import { GameLibraryProvider } from "./context/GameLibraryContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import AddGame from "./components/AddGame/AddGame.tsx";

function App() {
  return (
    <AuthProvider>
      <GameLibraryProvider>
        <Router>
          <div className="app">
            <Nav />
            <Routes>
              <Route path="/" element={<HeroPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route element={<PrivateRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/addgame" element={<AddGame />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </GameLibraryProvider>
    </AuthProvider>
  );
}

export default App;
