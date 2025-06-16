import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Restaurants.css"

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    cuisine: "",
    rating: ""
  });
   const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCuisine, setFilterCuisine] = useState("");
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

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("address", form.address);
  formData.append("cuisine", form.cuisine);
  formData.append("rating", form.rating);
  if (image) formData.append("image", image);

  try {
    if (editingId) {
      await axios.put(
        `http://localhost:5000/api/restaurants/${editingId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Restaurant updated!");
    } else {
      await axios.post("http://localhost:5000/api/restaurants", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Restaurant added!");
    }

    setForm({ name: "", address: "", cuisine: "", rating: "" });
    setImage(null);
    setEditingId(null);
    fetchRestaurants();
  } catch (err) {
    console.error(err);
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

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCuisine ? r.cuisine.toLowerCase() === filterCuisine.toLowerCase() : true)
  );


  return (
    <div>
      <h2>{editingId ? "Edit Restaurant" : "Add New Restaurant"}</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="cuisine" placeholder="Cuisine" value={form.cuisine} onChange={handleChange} />
        <input name="rating" placeholder="Rating" value={form.rating} onChange={handleChange} type="number" step="0.1" />
        <input
  type="file"
  accept="image/*"
  onChange={(e) => setImage(e.target.files[0])}
/>

        <button type="submit">{editingId ? "Update" : "Add"}</button>
        
      </form>
      
       <hr />

      <h3>Search / Filter</h3>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <input
        type="text"
        placeholder="Filter by cuisine..."
        value={filterCuisine}
        onChange={(e) => setFilterCuisine(e.target.value)}
      />

      <h2>Restaurant List</h2>
     <div className="restaurant-list">
  {filteredRestaurants.map((r) => (
    <div key={r._id} className="restaurant-card">
      <div className="restaurant-info">
      <img
  src={`http://localhost:5000${r.image}`}
  alt={r.name}
  className="restaurant-image"
/>
        <div className="restaurant-name">{r.name}</div>
        <div className="restaurant-details">{r.cuisine} | Rating: {r.rating}</div>
      </div>
      <div className="actions">
        <button onClick={() => handleEdit(r)}>Edit</button>
        <button onClick={() => handleDelete(r._id)}>Delete</button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default Restaurants;
