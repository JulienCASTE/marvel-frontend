import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import Pagination from "../components/Pagination";
import Hero from "../components/Hero";

const MAX_PER_PAGE = 100;

const Characters = ({ authUser }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoadingCharacters, setIsLoadingCharacters] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(searchParams.get("page") || 1);

  const [characters, setCharacters] = useState([]);
  const [count, setCount] = useState(0);

  // On recupère la liste des personnages au chargement ou lorsqu'on change de recherche/page
  useEffect(() => {
    // On souhaite annuler la requête si une nouvelle requête arrive
    const controller = new AbortController();

    const fetchCharacters = async () => {
      setIsLoadingCharacters(true);
      try {
        const skip = (page - 1) * MAX_PER_PAGE;
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/characters?limit=${MAX_PER_PAGE}&skip=${skip}&name=${search}`,
          {
            signal: controller.signal,
          }
        );

        setCharacters(response.data.results);
        setCount(response.data.count);
      } catch (error) {
        console.log(error);
      }
      setIsLoadingCharacters(false);
    };

    // On laisse 300ms de décalage avant de relancer la recherche pour laisser le temps à l'utilisateur d'écrire et ne pas lancer la recherche à chaque lettre
    const debounce = setTimeout(fetchCharacters, 300);

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
    <main id="characters">
      <Hero
        title="Personnages"
        imgUrl="https://cdn.marvel.com/content/1x/characters_art_mas_dsk_01.jpg"
        description="Tous les personnages MARVEL"
        input={
          <input
            type="search"
            placeholder="Rechercher un personnage"
            name="search"
            value={search}
            onChange={handleSearchChange}
          />
        }
      />
      <div className="container mx-auto px-4">
        <div className="list">
          {!isLoadingCharacters &&
            characters.length > 0 &&
            characters.map((character) => (
              <Card
                key={character._id}
                type={"characters"}
                id={character._id}
                name={character.name}
                description={character.description}
                thumbnailUrl={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                authUser={authUser}
              />
            ))}
          {!isLoadingCharacters && characters.length === 0 && (
            <p className="no-data">
              Aucune personnage ne correspond à votre recherche
            </p>
          )}
          {isLoadingCharacters && <p className="loading">Chargement...</p>}
        </div>
        {!isLoadingCharacters && characters.length > 0 && (
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

export default Characters;
