import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "./components/Header";
import Home from "./pages/Home";
import Characters from "./pages/Characters";
import Comics from "./pages/Comics";
import Favorites from "./pages/Favorites";
import CharacterWithComics from "./pages/CharacterWithComics";
import Comic from "./pages/Comic";
import { useEffect } from "react";
import { connectAuthUser } from "./utils/authentication";
import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { syncFavorites } from "./utils/favorites";

function App() {
  const [authUser, setAuthUser] = useState(null);

  // Au démarrage on essaie de connecter l'utilisateur
  useEffect(() => {
    const authToken = Cookies.get("authToken");
    connectAuthUser(authToken, setAuthUser);
  }, []);

  // On essaie de synchroniser les favoris lorsque l'utilisateur se connecte
  useEffect(() => {
    syncFavorites(authUser);
  }, [authUser]);

  return (
    <Router>
      <Header authUser={authUser} setAuthUser={setAuthUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/personnages"
          element={<Characters authUser={authUser} />}
        />
        <Route
          path="/personnages/:characterId"
          element={<CharacterWithComics authUser={authUser} />}
        />
        <Route path="/comics" element={<Comics authUser={authUser} />} />
        <Route path="/comics/:comicId" element={<Comic />} />
        <Route path="/favoris" element={<Favorites authUser={authUser} />} />
        <Route
          path="/connexion"
          element={<Login authUser={authUser} setAuthUser={setAuthUser} />}
        />
        <Route
          path="/inscription"
          element={<Signup authUser={authUser} setAuthUser={setAuthUser} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
