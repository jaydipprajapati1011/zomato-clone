import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    cuisine: "",
    rating: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios.get("http://localhost:5000/api/restaurants")
      .then(res => setRestaurants(res.data))
      .catch(err => console.error(err));
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/api/restaurants", form)
      .then(res => {
        alert("Restaurant added!");
        setForm({ name: "", address: "", cuisine: "", rating: "" });
        return axios.get("http://localhost:5000/api/restaurants");
      })
      .then(res => setRestaurants(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Add New Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="cuisine" placeholder="Cuisine" value={form.cuisine} onChange={handleChange} />
        <input name="rating" placeholder="Rating" value={form.rating} onChange={handleChange} type="number" step="0.1" />
        <button type="submit">Add</button>
      </form>

      <h2>Restaurant List</h2>
      <ul>
        {restaurants.map((r) => (
          <li key={r._id}>
            <strong>{r.name}</strong> | {r.cuisine} | Rating: {r.rating}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Restaurants;
