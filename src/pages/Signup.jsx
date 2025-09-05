import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { connectAuthUser } from "../utils/authentication";

const Signup = ({ authUser, setAuthUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Si l'utilisateur est connecté on le redirige vers la page principale
  useEffect(() => {
    if (null !== authUser) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/signup`,
        {
          username: username,
          email: email,
          password: password,
        }
      );

      if (201 === response.status && response.data.token) {
        connectAuthUser(response.data.token, setAuthUser);
        console.log(location, location.state);
        navigate(location.state?.previousUrl || "/");

        return;
      }
      setErrorMessage(response.data.message);
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <main id="login">
      <h1>S'inscrire</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">S'inscrire</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </main>
  );
};

export default Signup;
