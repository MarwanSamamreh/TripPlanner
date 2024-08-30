import { handleSubmit } from "../src/client/js/FormHandler.js";
import { checkDateFormat } from "../src/client/js/DateChecker.js";

jest.mock("../src/client/js/DateChecker.js", () => ({
  checkDateFormat: jest.fn(),
}));

global.fetch = jest.fn();

describe("handleSubmit", () => {
  let event;

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="travel-form">
        <input id="place" value="Paris" />
        <input id="date" value="12/25/23" />
      </form>
      <div id="results-section"></div>
    `;

    event = { preventDefault: jest.fn() };
    fetch.mockClear();
    checkDateFormat.mockClear();
  });

  it("should call preventDefault on the event", async () => {
    checkDateFormat.mockReturnValue(true);
    fetch.mockResolvedValue({
      json: async () => ({
        geonames: [{ lat: 48.8566, lng: 2.3522, countryName: "France" }],
        data: [{ temp: 15, weather: { description: "Sunny" } }],
        hits: [{ webformatURL: "some-url.jpg" }],
      }),
    });

    await handleSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("should alert if the date format is invalid", async () => {
    checkDateFormat.mockReturnValue(false);
    jest.spyOn(window, "alert").mockImplementation(() => {});

    await handleSubmit(event);

    expect(window.alert).toHaveBeenCalledWith(
      "Please enter a valid date in MM/DD/YY format."
    );
  });

  it("should fetch and update UI when the form is valid", async () => {
    checkDateFormat.mockReturnValue(true);

    fetch
      .mockResolvedValueOnce({
        json: async () => ({
          geonames: [{ lat: 48.8566, lng: 2.3522, countryName: "France" }],
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          data: [{ temp: 15, weather: { description: "Sunny" } }],
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ hits: [{ webformatURL: "some-url.jpg" }] }),
      });

    await handleSubmit(event);

    const resultSection = document.getElementById("results-section");
    expect(resultSection.innerHTML).toContain("Paris, France");
    expect(resultSection.innerHTML).toContain("Sunny");
    expect(resultSection.innerHTML).toContain("some-url.jpg");
  });

  it("should handle fetch errors gracefully", async () => {
    checkDateFormat.mockReturnValue(true);
    fetch.mockRejectedValueOnce(new Error("API error"));

    await handleSubmit(event);

    const resultSection = document.getElementById("results-section");
    expect(resultSection.innerHTML).toBe("");
  });
});
