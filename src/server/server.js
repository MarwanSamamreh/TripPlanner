const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../../dist")));

app.get("/api/config", (req, res) => {
  res.json({
    geonamesUsername: process.env.GEONAMES_USERNAME,
    weatherbitApiKey: process.env.WEATHERBIT_API_KEY,
    pixabayApiKey: process.env.PIXABAY_API_KEY,
  });
});

const WEATHERBIT_API_URL = "https://api.weatherbit.io/v2.0/forecast/daily";
const PIXABAY_API_URL = "https://pixabay.com/api/";
const GEONAMES_API_URL = "https://api.geonames.org/searchJSON";

// Serve index.html on the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

// Endpoint to fetch weather data
app.get("/weather", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  const apiKey = process.env.WEATHERBIT_API_KEY; // Fix: should be WEATHERBIT_API_KEY
  const apiUrl = `${WEATHERBIT_API_URL}?lat=${lat}&lon=${lon}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Endpoint to fetch image data
app.get("/image", async (req, res) => {
  const { place } = req.query;

  if (!place) {
    return res.status(400).json({ error: "Place is required" });
  }

  const apiKey = process.env.PIXABAY_API_KEY; // Fix: should be PIXABAY_API_KEY
  const apiUrl = `${PIXABAY_API_URL}?key=${apiKey}&q=${encodeURIComponent(
    place
  )}&image_type=photo`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch image data" });
  }
});

// Endpoint to fetch coordinates from GeoNames API
app.get("/geo", async (req, res) => {
  const { place } = req.query;

  if (!place) {
    return res.status(400).json({ error: "Place is required" });
  }

  const geonamesUsername = process.env.GEONAMES_USERNAME; // Use environment variable
  const apiUrl = `${GEONAMES_API_URL}?q=${encodeURIComponent(
    place
  )}&maxRows=1&username=${geonamesUsername}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch geo data" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000!");
});
