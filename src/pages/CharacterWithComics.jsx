import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Hero from "../components/Hero";
import Card from "../components/Card";

const CharacterWithComics = ({ authUser }) => {
  const [characterWithComics, setCharacterWithComics] = useState(null);
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(true);

  const { characterId } = useParams();

  // On recupère les données du personnage
  useEffect(() => {
    const fetchCharacterWithComics = async () => {
      setIsLoadingCharacter(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/comics/${characterId}`
        );

        setCharacterWithComics(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoadingCharacter(false);
    };

    fetchCharacterWithComics();
  }, [characterId]);

  return (
    <main id="character-with-comics">
      {!isLoadingCharacter && characterWithComics && (
        <Hero
          title={characterWithComics.name}
          imgUrl={`${characterWithComics.thumbnail.path}.${characterWithComics.thumbnail.extension}`}
          description={characterWithComics.description}
        />
      )}
      <div className="container mx-auto px-4">
        {!isLoadingCharacter && characterWithComics ? (
          <div className="list">
            {characterWithComics.comics &&
              characterWithComics.comics.map((comic) => (
                <Card
                  key={comic._id}
                  type={"comics"}
                  id={comic._id}
                  name={comic.title}
                  description={comic.description}
                  thumbnailUrl={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                  authUser={authUser}
                />
              ))}
          </div>
        ) : (
          <p className="loading">Chargement...</p>
        )}
      </div>
    </main>
  );
};

export default CharacterWithComics;
