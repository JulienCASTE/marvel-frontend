import { useEffect, useState } from "react";
import Card from "../components/Card";
import { getFavorites, syncFavorites } from "../utils/favorites";
import Hero from "../components/Hero";

const Favorites = ({ authUser }) => {
  const [favorites, setFavorites] = useState({ characters: {}, comics: {} });
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  // On recupère les favoris au démarrage
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoadingFavorites(true);
      await syncFavorites();
      setFavorites(getFavorites());
      setIsLoadingFavorites(false);
    };

    fetchFavorites();
  }, []);

  return (
    <main id="favorites">
      <Hero
        title="Favoris"
        imgUrl="https://cdn.marvel.com/content/1x/news_articles-mas_dsk_01.jpg"
        description="Vos personnages et comics favoris"
      />
      <div className="container mx-auto px-4">
        <h2>Personnages favoris</h2>
        {!isLoadingFavorites &&
          Object.keys(favorites.characters).length > 0 && (
            <div className="list">
              {Object.entries(favorites.characters).map((favorite) => {
                const character = favorite[1];

                return (
                  <Card
                    key={character.id}
                    type={"characters"}
                    id={character.id}
                    name={character.name}
                    description={character.description}
                    thumbnailUrl={character.thumbnailUrl}
                    authUser={authUser}
                  />
                );
              })}
            </div>
          )}
        {!isLoadingFavorites &&
          Object.keys(favorites.characters).length === 0 && (
            <p className="no-data">Aucun personnage en favoris</p>
          )}
        {isLoadingFavorites && <p className="loading">Chargement...</p>}
        <h2>Comics favoris</h2>
        {!isLoadingFavorites && Object.keys(favorites.comics).length > 0 && (
          <div className="list">
            {Object.entries(favorites.comics).map((favorite) => {
              const comic = favorite[1];

              return (
                <Card
                  key={comic.id}
                  type={"comics"}
                  id={comic.id}
                  name={comic.name}
                  description={comic.description}
                  thumbnailUrl={comic.thumbnailUrl}
                  authUser={authUser}
                />
              );
            })}
          </div>
        )}
        {!isLoadingFavorites && Object.keys(favorites.comics).length === 0 && (
          <p className="no-data">Aucun comic en favoris</p>
        )}
        {isLoadingFavorites && <p className="loading">Chargement...</p>}
      </div>
    </main>
  );
};

export default Favorites;
