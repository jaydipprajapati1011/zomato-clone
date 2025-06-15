import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import RestaurantCard from "./components/RestaurantCard";
//import RestaurantDetail from "./pages/RestaurantDetail";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./Dashboard";
import Home from "./Home";
import RestaurantDetail from "./RestaurantDetail";
import AddRestaurant from "./AddRestaurant";
import Restaurants from "./Restaurants";


function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/restaurants")
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Filter restaurants based on search input
  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchText.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <div style={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.container}>
                {filteredRestaurants.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => navigate(`/restaurant/${res.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <RestaurantCard
                      name={res.name}
                      image={res.image}
                      cuisine={res.cuisine}
                    />
                  </div>
                ))}
              </div>
            </div>
          }
        />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/add-restaurant" element={<AddRestaurant />} />
        <Route path="/restaurants" element={<Restaurants />} />
      </Routes>
      
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: "20px",
  },
  searchBox: {
    textAlign: "center",
    marginTop: "20px",
  },
  input: {
    padding: "10px",
    width: "80%",
    maxWidth: "400px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
};

export default App;
