import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Hero from "../components/Hero";

const Comic = () => {
  const [comic, setComic] = useState(null);
  const [isLoadingComic, setIsLoadingComic] = useState(true);

  const { comicId } = useParams();

  // On récupère les données du comic
  useEffect(() => {
    const fetchComic = async () => {
      setIsLoadingComic(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/comic/${comicId}`
        );

        setComic(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoadingComic(false);
    };

    fetchComic();
  }, [comicId]);

  return (
    <main id="comic">
      {!isLoadingComic && comic && (
        <Hero
          title={comic.title}
          imgUrl={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
          description={comic.description}
        />
      )}
      <div className="container mx-auto px-4">
        {isLoadingComic && <p className="loading">Chargement...</p>}
      </div>
    </main>
  );
};

export default Comic;
