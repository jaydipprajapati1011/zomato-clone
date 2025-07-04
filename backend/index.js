const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key"; // Replace this with an environment variable later
const authMiddleware = require("./middleware/auth");
const Restaurant = require("./models/Restaurant");
const multer = require("multer");
const path = require("path");


// Replace the following with your real connection string from MongoDB
const MONGO_URL = "mongodb+srv://jay217811:zomato123@cluster0.cbvuarr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection failed:", err));

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(new Error("Only JPG and PNG images are allowed")); // Reject file
    }
  },
});

// Signup
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error signing up" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Generate token
    const token = jwt.sign({ email: user.email, id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
});



  // dashboard api
  app.get("/api/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, this is your dashboard.` });
});

  // Add a restaurant (admin only for now)
app.post("/api/restaurants", upload.single("image"), async (req, res) => {
  const {  name, address, cuisine, rating  } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";
 
  try {
    const newRestaurant = new Restaurant({ name, address, cuisine, rating ,image,});
    await newRestaurant.save();
    res.status(201).json({ message: "Restaurant added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding restaurant" });
  }
});

// Get all restaurants
app.get("/api/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: "Error fetching restaurants" });
  }
});
// Get one restaurant by ID
app.get("/api/restaurants/:id", async (req, res) => {
  try {
        const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return res.status(404).json({ message: "Not found" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Error fetching restaurant" });
  }
});

//Delete Restaurant Route
app.delete("/api/restaurants/:id", async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: "Restaurant deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting restaurant" });
  }
});

//Update Restaurant Route
app.put("/api/restaurants/:id", upload.single("image"), async (req, res) => {
  const { name, address, cuisine, rating } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const updateData = { name, address, cuisine, rating };
    if (image) updateData.image = image;

    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating restaurant" });
  }
});




// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
