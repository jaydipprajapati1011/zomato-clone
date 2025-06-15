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
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetchRestaurants();
  }, [navigate]);

  const fetchRestaurants = () => {
    axios.get("http://localhost:5000/api/restaurants")
      .then(res => setRestaurants(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // Edit existing
      axios.put(`http://localhost:5000/api/restaurants/${editingId}`, form)
        .then(() => {
          alert("Restaurant updated!");
          setForm({ name: "", address: "", cuisine: "", rating: "" });
          setEditingId(null);
          fetchRestaurants();
        })
        .catch(err => console.error(err));
    } else {
      // Add new
      axios.post("http://localhost:5000/api/restaurants", form)
        .then(() => {
          alert("Restaurant added!");
          setForm({ name: "", address: "", cuisine: "", rating: "" });
          fetchRestaurants();
        })
        .catch(err => console.error(err));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete?")) {
      axios.delete(`http://localhost:5000/api/restaurants/${id}`)
        .then(() => fetchRestaurants())
        .catch(err => console.error(err));
    }
  };

  const handleEdit = (restaurant) => {
    setForm({
      name: restaurant.name,
      address: restaurant.address,
      cuisine: restaurant.cuisine,
      rating: restaurant.rating
    });
    setEditingId(restaurant._id);
  };

  return (
    <div>
      <h2>{editingId ? "Edit Restaurant" : "Add New Restaurant"}</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="cuisine" placeholder="Cuisine" value={form.cuisine} onChange={handleChange} />
        <input name="rating" placeholder="Rating" value={form.rating} onChange={handleChange} type="number" step="0.1" />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <h2>Restaurant List</h2>
      <ul>
        {restaurants.map((r) => (
          <li key={r._id}>
            <strong>{r.name}</strong> | {r.cuisine} | Rating: {r.rating}
            <button onClick={() => handleEdit(r)}>Edit</button>
            <button onClick={() => handleDelete(r._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Restaurants;
