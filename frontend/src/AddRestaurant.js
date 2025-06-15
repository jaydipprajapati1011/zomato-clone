import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    cuisine: "",
    image: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/restaurants", formData)
      .then((res) => {
        setMessage("Restaurant added successfully!");
        setFormData({ name: "", location: "", cuisine: "", image: "" });
        navigate("/"); // go to home after success
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to add restaurant.");
      });
  };

  return (
    <div>
      <h2>Add New Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Restaurant Name"
          value={formData.name}
          onChange={handleChange}
          required
        /><br />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        /><br />

        <input
          type="text"
          name="cuisine"
          placeholder="Cuisine"
          value={formData.cuisine}
          onChange={handleChange}
        /><br />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        /><br />

        <button type="submit">Add Restaurant</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddRestaurant;
