const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure MongoDB URI is loaded correctly
console.log(process.env.MONGO_URI);  // Log the URI to check if it's loaded

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Restaurant Schema and Model
const restaurantSchema = new mongoose.Schema({
    name: String,
    image: String,
    menu: [
        {
            name: String,
            price: Number,
            image: String,
        },
    ],
    rating: Number,
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

// Seed initial data
const seedData = [
    {
        name: "Italian Delight",
        image: "https://media.geeksforgeeks.org/wp-content/uploads/20240110004602/pexels-chan-walrus-958545-(1).jpg",
        menu: [
            {
                name: "Pasta Alfredo",
                price: 10,
                image: "https://media.geeksforgeeks.org/wp-content/uploads/20240110004646/file.jpg",
            },
            {
                name: "Margherita Pizza",
                price: 15,
                image: "https://media.geeksforgeeks.org/wp-content/uploads/20240110004646/file.jpg",
            },
            {
                name: "Chicken Parmesan",
                price: 20,
                image: "https://media.geeksforgeeks.org/wp-content/uploads/20240110004646/file.jpg",
            },
        ],
        rating: 4.5,
    },
    // More restaurants...
];

// Seed the database (You may want to call this function manually during development)
const seedDatabase = async () => {
    try {
        await Restaurant.deleteMany(); // Clear existing data
        await Restaurant.insertMany(seedData);
        console.log("Database seeded successfully.");
    } catch (error) {
        console.error("Error seeding the database:", error.message);
    }
};

// Example endpoint to seed the database (if needed)
app.get("/seed", async (req, res) => {
    await seedDatabase();
    res.send("Database seeded!");
});

// Example route to fetch all restaurants
app.get("/restaurants", async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
