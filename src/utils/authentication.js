import Cookies from "js-cookie";
import axios from "axios";

// On définit l'utilisateur comme connecté
export const connectAuthUser = async (authToken, setAuthUser) => {
  if (!authToken) {
    disconnectAuthUser(setAuthUser);

    return null;
  }

  Cookies.set("authToken", authToken);

  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/user/token/${authToken}`
  );

  setAuthUser(response.data);

  return response.data;
};

// On définit l'utilisateur comme déconnecté
export const disconnectAuthUser = async (setAuthUser) => {
  Cookies.remove("authToken");
  setAuthUser(null);
};
