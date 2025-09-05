import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import Pagination from "../components/Pagination";
import Hero from "../components/Hero";

const MAX_PER_PAGE = 100;
const Comics = ({ authUser }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoadingComics, setIsLoadingComics] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(searchParams.get("page") || 1);

  const [comics, setComics] = useState([]);
  const [count, setCount] = useState(0);

  // On recupère la liste des comics au chargement ou lorsqu'on change de recherche/page
  useEffect(() => {
    // On souhaite annuler la requête si une nouvelle requête arrive
    const controller = new AbortController();

    const fetchComics = async () => {
      setIsLoadingComics(true);
      try {
        const skip = (page - 1) * MAX_PER_PAGE;

        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/comics?limit=${MAX_PER_PAGE}&skip=${skip}&title=${search}`,
          {
            signal: controller.signal,
          }
        );

        setComics(response.data.results);
        setCount(response.data.count);
      } catch (error) {
        console.log(error);
      }
      setIsLoadingComics(false);
    };

    // On laisse 300ms de décalage avant de relancer la recherche pour laisser le temps à l'utilisateur d'écrire et ne pas lancer la recherche à chaque lettre
    const debounce = setTimeout(fetchComics, 300);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [search, page]);

  // On initialise les paramètres par rapport à l'url
  useEffect(() => {
    setSearch(searchParams.get("search") || search);
    setPage(searchParams.get("page") || page);
  }, [searchParams]);

  // Lorsqu'on modifie le champ de recherche, on met à jour dans l'url
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setSearchParams((prev) => {
      event.target.value
        ? prev.set("search", event.target.value)
        : prev.delete("search");

      return prev;
    });
  };

  // Lorsqu'on modifie la page, on met à jour dans l'url
  const onPageChange = (page) => {
    setPage(page);
    setSearchParams((prev) => {
      prev.set("page", page);

      return prev;
    });
  };

  return (
    <main id="comics">
      <Hero
        title="Comics"
        imgUrl="https://cdn.marvel.com/content/2x/immortal-thor-desktop.jpg"
        description="Tous les comics MARVEL"
        input={
          <input
            type="search"
            placeholder="Rechercher un comic"
            name="search"
            value={search}
            onChange={handleSearchChange}
          />
        }
      />
      <div className="container mx-auto px-4">
        <div className="list">
          {!isLoadingComics &&
            comics.length > 0 &&
            comics.map((comic) => (
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
          {!isLoadingComics && comics.length === 0 && (
            <p className="no-data">
              Aucune comic ne correspond à votre recherche
            </p>
          )}
          {isLoadingComics && <p className="loading">Chargement...</p>}
        </div>
        {!isLoadingComics && comics.length > 0 && (
          <Pagination
            currentPage={page}
            maxPerPage={MAX_PER_PAGE}
            count={count}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </main>
  );
};

export default Comics;
