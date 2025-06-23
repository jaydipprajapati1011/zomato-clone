import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/restaurants")
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Restaurants</h1>

      <Link to="/add-restaurant">Add New Restaurant</Link>

      {restaurants.map((res) => (
        <div key={res._id}>
          <h2>{res.name}</h2>
          <p>{res.address} | {res.cuisine}</p>
          <Link to={`/restaurants/${res._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
