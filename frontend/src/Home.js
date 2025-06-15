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
      {restaurants.map((res) => (
        <div key={res._id}>
          <h2>{res.name}</h2>
          <p>{res.location} | {res.cuisine}</p>
          <Link to={`/restaurant/${res._id}`}>View Details</Link>
          <Link to="/add-restaurant">Add New Restaurant</Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
