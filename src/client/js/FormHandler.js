import { checkDateFormat } from "./DateChecker.js";

let config = {};

// Fetch the process.env variables since it's on the server side
async function fetchConfig() {
  try {
    const response = await fetch("/api/config");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    config = await response.json();
  } catch (error) {
    console.error("Error fetching config:", error);
  }
}

export async function handleSubmit(event) {
  event.preventDefault();

  const place = document.getElementById("place").value;
  const dateInput = document.getElementById("date").value;

  // Ensure the date format is valid
  if (!checkDateFormat(dateInput)) {
    alert("Please enter a valid date in MM/DD/YY format.");
    return;
  }

  // Parse the date input manually for consistency (MM/DD/YY)
  const [month, day, year] = dateInput.split("/");
  const formattedDate = new Date(`20${year}`, month - 1, day);
  const today = new Date();

  // Calculate the number of days between the entered date and today
  const timeDifference = formattedDate - today;
  const daysAway = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  // Fetch configuration if not already fetched
  if (!config.geonamesUsername) {
    await fetchConfig();
  }

  if (!config.geonamesUsername) {
    console.error("GeoNames username not found in config.");
    return;
  }

  try {
    // Fetch geonames data
    const geoNamesUrl = `https://secure.geonames.org/searchJSON?q=${place}&maxRows=1&username=${config.geonamesUsername}`;
    const geoResponse = await fetch(geoNamesUrl);
    if (!geoResponse.ok)
      throw new Error(`HTTP error! status: ${geoResponse.status}`);
    const geoData = await geoResponse.json();

    if (geoData.geonames.length === 0) {
      alert("No location data found. Please try another place.");
      return;
    }

    const { lat, lng: lon, countryName } = geoData.geonames[0];

    // Fetch weather data
    const weatherResponse = await fetch(
      `/weather?lat=${lat}&lon=${lon}&date=${encodeURIComponent(dateInput)}`
    );
    if (!weatherResponse.ok)
      throw new Error(`HTTP error! status: ${weatherResponse.status}`);
    const weatherData = await weatherResponse.json();

    // Fetch image data
    const imageResponse = await fetch(
      `/image?place=${encodeURIComponent(place)}`
    );
    if (!imageResponse.ok)
      throw new Error(`HTTP error! status: ${imageResponse.status}`);
    const imageData = await imageResponse.json();

    // Update UI with weather and image data
    updateUI(weatherData, imageData, place, countryName, daysAway);
  } catch (error) {
    console.error("Error during form submission:", error);
  }
}

function updateUI(weatherData, imageData, place, country, daysAway) {
  const resultsSection = document.getElementById("results-section");

  const weather = weatherData.data[0];
  const image =
    imageData.hits.length > 0
      ? imageData.hits[0].webformatURL
      : "default-image-url.jpg";

  const card = document.createElement("div");
  card.classList.add("result-card");

  card.innerHTML = `
    <img src="${image}" alt="Image of ${place}" class="result-image">
    <div class="result-info">
        <h2>${place}, ${country}</h2>
        <p>${daysAway} day(s) away</p>
        <p>Forecasted Temperature: ${weather.temp}°C</p>
        <p>Forecasted Weather: ${weather.weather.description}</p>
    </div>
    <button class="remove-card-btn">Remove</button>
  `;

  const removeButton = card.querySelector(".remove-card-btn");
  removeButton.addEventListener("click", () => {
    resultsSection.removeChild(card);
  });

  resultsSection.appendChild(card);
}
