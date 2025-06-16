import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRestaurant = () => {
  const [form, setForm] = useState({
    name: "",
    location: "",
    cuisine: "",
    rating: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("address", form.address);
    formData.append("cuisine", form.cuisine);
    formData.append("rating", form.rating);
    formData.append("image", form.image);

    try {
      const res = await axios.post("http://localhost:5000/api/restaurants", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Restaurant added successfully!");
      setForm({
        name: "",
        address: "",
        cuisine: "",
        rating: "",
        image: null,
      });

      navigate("/restaurants", { state: { refresh: true } });
    } catch (err) {
      console.error(err);
      setMessage("Failed to add restaurant.");
    }
  };

  return (
    <div>
      <h2>Add New Restaurant</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Restaurant Name"
          value={form.name}
          onChange={handleChange}
          required
        /><br />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        /><br />

        <input
          type="text"
          name="cuisine"
          placeholder="Cuisine"
          value={form.cuisine}
          onChange={handleChange}
        /><br />

        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={form.rating}
          onChange={handleChange}
          min="0"
          max="5"
          step="0.1"
        /><br />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        /><br />

        <button type="submit">Add Restaurant</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddRestaurant;
