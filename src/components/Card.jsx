import { Link } from "react-router-dom";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { addFavorite, isFavorite, removeFavorite } from "../utils/favorites";
import { useState } from "react";

const Card = ({ type, id, name, description, thumbnailUrl, authUser }) => {
  const [isUserFavorite, setIsUserFavorite] = useState(isFavorite(type, id));

  return (
    <div className="card">
      {isUserFavorite && (
        <StarIconSolid
          className="favorite"
          title="Supprimer des favoris"
          onClick={() => {
            removeFavorite(authUser, type, id);
            setIsUserFavorite(false);
          }}
        />
      )}
      {!isUserFavorite && (
        <StarIconOutline
          className="favorite"
          title="Ajouter aux favoris"
          onClick={() => {
            addFavorite(authUser, type, {
              id,
              name,
              description,
              thumbnailUrl,
            });
            setIsUserFavorite(true);
          }}
        />
      )}
      <Link to={`/${"characters" === type ? "personnages" : type}/${id}`}>
        <div className="card-image">
          <img src={thumbnailUrl} alt="" />
        </div>
        <div className="card-infos">
          <p className="card-infos--title">{name}</p>
          <p
            className="card-infos--description"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </Link>
    </div>
  );
};

export default Card;
