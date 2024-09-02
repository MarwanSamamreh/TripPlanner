
# Trip Planner
# Node Version: v20.10.0
Overview
Trip Planner is a web application that allows users to plan their trips by interacting with three different APIs to provide detailed information about the destination, including weather, images, and more. This project demonstrates the use of various modern web development technologies such as DOM manipulation, API handling, Webpack, service workers, and testing with Jest.

## Features
API Integration: The application communicates with three different APIs to fetch location data, weather information, and images for the planned trip.

DOM Manipulation: We utilize the knowledge of DOM manipulation to dynamically update the UI based on user input and API responses.

Webpack: The project is bundled using Webpack, optimizing it for production deployment.

Service Workers: Service workers are implemented to allow the application to work offline and improve performance.

Jest: Unit tests are written using Jest to ensure the reliability of key functions and components.

## Prerequisites
To run this project locally, you'll need to have the following:

Node.js and npm installed on your machine.

API keys for the three APIs used in the project : geonames, weatherbit, and pixabay.

## Getting Started
### 1. Clone the repository:
```bash
git clone https://github.com/your-username/trip-planner.git
cd trip-planner
```
### 2. Install dependencies:
```bash

npm install
```
### 3. Set up API keys:
Create a .env file in the root directory and add your API keys:

```
WEATHERBIT_API_KEY=
PIXABAY_API_KEY=
GEONAMES_USERNAME=
```
### 4. Build the project:
For production:

```bash

npm run build-prod
```
### 5. Start the application:
```bash
npm run start
```
This will start the server, and you can access the application at http://localhost:3000.

## Testing
To run the tests with Jest, simply run:

```bash

npm run test
```

This will execute all unit tests defined in the __test__ directory.

## Project Structure
src/: Contains the main application code, including the DOM manipulation logic, API handlers, and service worker.

test/: Contains the Jest test cases.

dist/: Contains the bundled code ready for deployment (generated after running npm run build-prod).

## Technologies Used
HTML/CSS/JavaScript: Core technologies for building the web interface.

Webpack: Module bundler for managing assets and code.

Service Workers: To enable offline capabilities and improve performance.

Jest: JavaScript testing framework for writing unit tests.

APIs: Three different APIs.
