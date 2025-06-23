import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("Invalid restaurant ID");
      return;
    }

    axios.get(`http://localhost:5000/api/restaurants/${id}`)
      .then((res) => setRestaurant(res.data))
      .catch((err) => {
        console.error(err);
        setError("Could not fetch restaurant");
      });
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!restaurant) return <div>Loading...</div>;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.address}</p>
      <p>{restaurant.cuisine}</p>
      {restaurant.image && (
        <img
          src={`http://localhost:5000${restaurant.image}`}
          alt={restaurant.name}
          width="300"
        />
      )}
    </div>
  );
};

export default RestaurantDetail;