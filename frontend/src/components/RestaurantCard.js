// src/components/RestaurantCard.js
import React from "react";

function RestaurantCard({ name, image, cuisine }) {
  return (
    <div style={styles.card}>
      <img src={image} alt={name} style={styles.image} />
      <h3>{name}</h3>
      <p>{cuisine}</p>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    margin: "10px",
    width: "200px",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "120px",
    borderRadius: "8px",
    objectFit: "cover",
  },
};

export default RestaurantCard;
