import { checkDateFormat } from "./DateChecker.js";

let config = {};

//to fetch the proccess.env variables since its on the server side
async function fetchConfig() {
  try {
    const response = await fetch("/api/config");
    config = await response.json();
  } catch (error) {
    console.error("Error fetching config:", error);
  }
}

export async function handleSubmit(event) {
  event.preventDefault();

  const place = document.getElementById("place").value;
  const dateInput = document.getElementById("date").value;

  if (!checkDateFormat(dateInput)) {
    alert("Please enter a valid date in MM/DD/YY format.");
    return;
  }

  // Calculate the number of days between the entered date and today
  const today = new Date();
  const enteredDate = new Date(dateInput);
  const timeDifference = enteredDate - today;
  const daysAway = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  // Fetch configuration if not already fetched
  if (!config.geonamesUsername) {
    await fetchConfig();
  }

  try {
    const geoNamesUrl = `http://api.geonames.org/searchJSON?q=${place}&maxRows=1&username=${config.geonamesUsername}`;
    const geoResponse = await fetch(geoNamesUrl);
    const geoData = await geoResponse.json();

    if (geoData.geonames.length === 0) {
      alert("No location data found. Please try another place.");
      return;
    }

    const { lat, lng: lon, countryName } = geoData.geonames[0];

    const weatherResponse = await fetch(
      `/weather?lat=${lat}&lon=${lon}&date=${encodeURIComponent(dateInput)}`
    );
    const weatherData = await weatherResponse.json();

    const imageResponse = await fetch(
      `/image?place=${encodeURIComponent(place)}`
    );
    const imageData = await imageResponse.json();

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
        <p>Forcasted Temperature: ${weather.temp}°C</p>
        <p>Forcasted Weather: ${weather.weather.description}</p>
    </div>
    <button class="remove-card-btn">Remove</button>
  `;

  const removeButton = card.querySelector(".remove-card-btn");
  removeButton.addEventListener("click", () => {
    resultsSection.removeChild(card);
  });

  resultsSection.appendChild(card);
}
