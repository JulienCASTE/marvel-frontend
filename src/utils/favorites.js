import axios from "axios";

// Ajoute un favori en BDD s'il est connecté et dans le localStorage
export const addFavorite = async (authUser, type, data) => {
  const id = data.id;
  if (authUser) {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/favorites/${type}/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  const favorites = getFavorites();

  if (undefined !== favorites[type][id]) {
    return;
  }

  const newFavorites = structuredClone(favorites);
  newFavorites[type][id] = data;
  localStorage.setItem("favorites", JSON.stringify(newFavorites));
};

// Supprime un favori en BDD s'il est connecté et dans le localStorage
export const removeFavorite = async (authUser, type, id) => {
  console.log(authUser);
  if (authUser) {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/favorites/${type}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  const favorites = getFavorites();

  if (undefined === favorites[type][id]) {
    return;
  }

  const newFavorites = structuredClone(favorites);
  delete newFavorites[type][id];
  localStorage.setItem("favorites", JSON.stringify(newFavorites));
};

// On vérifie si l'objet est dans les favoris
export const isFavorite = (type, id) => {
  const favorites = getFavorites();

  return undefined !== favorites[type][id];
};

// Lorsque l'utilisateur est connecté, on synchronise les favoris de la BDD et ceux du localStorage
export const syncFavorites = async (authUser) => {
  if (!authUser) {
    return;
  }

  const localStorageFavorites = getFavorites();

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/favorites`,
      {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      }
    );

    const databaseFavorites = response.data;
    const newLocalStorageFavorites = structuredClone(localStorageFavorites);

    // On ajoute les favoris présents uniquement en BDD dans le localStorage
    for (const type of Object.keys(databaseFavorites)) {
      for (const id of Object.keys(databaseFavorites[type])) {
        if (undefined === newLocalStorageFavorites[type][id]) {
          newLocalStorageFavorites[type][id] = structuredClone(
            databaseFavorites[type][id]
          );
        }
      }
    }

    localStorage.setItem("favorites", JSON.stringify(newLocalStorageFavorites));

    // On ajoute les favoris présents uniquement dans le localStorage en BDD
    for (const type of Object.keys(newLocalStorageFavorites)) {
      for (const id of Object.keys(newLocalStorageFavorites[type])) {
        if (undefined === databaseFavorites[type][id]) {
          await addFavorite(authUser, type, newLocalStorageFavorites[type][id]);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const getFavorites = () => {
  return (
    JSON.parse(localStorage.getItem("favorites")) || {
      characters: {},
      comics: {},
    }
  );
};
