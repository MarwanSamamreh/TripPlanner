const request = require("supertest");
const express = require("express");
const app = require("../src/server/server.js");

describe("API Endpoints", () => {
  it("should return configuration", async () => {
    const response = await request(app).get("/api/config");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("geonamesUsername");
    expect(response.body).toHaveProperty("weatherbitApiKey");
    expect(response.body).toHaveProperty("pixabayApiKey");
  });

  it("should serve index.html at the root route", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.header["content-type"]).toBe("text/html; charset=UTF-8");
  });

  it("should return weather data", async () => {
    // Mock fetch responses
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: "weather data" }),
      })
    );

    const response = await request(app)
      .get("/weather")
      .query({ lat: "40.7128", lon: "-74.0060" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: "weather data" });
  });

  it("should return an error if latitude or longitude is missing", async () => {
    const response = await request(app).get("/weather");
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Latitude and longitude are required");
  });

  it("should return image data", async () => {
    // Mock fetch responses
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ hits: "image data" }),
      })
    );

    const response = await request(app).get("/image").query({ place: "Paris" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ hits: "image data" });
  });

  it("should return an error if place is missing", async () => {
    const response = await request(app).get("/image");
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Place is required");
  });

  it("should return geo data", async () => {
    // Mock fetch responses
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ geonames: "geo data" }),
      })
    );

    const response = await request(app)
      .get("/geo")
      .query({ place: "New York" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ geonames: "geo data" });
  });

  it("should return an error if place is missing in geo endpoint", async () => {
    const response = await request(app).get("/geo");
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Place is required");
  });
});
