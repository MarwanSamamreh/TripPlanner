import { checkDateFormat } from "../src/client/DateChecker.js";

describe("checkDateFormat", () => {
  it("should return true for valid date formats", () => {
    const validDate = "12/25/23"; // MM/DD/YY format
    expect(checkDateFormat(validDate)).toBe(true);
  });

  it("should return false for an invalid date format", () => {
    const invalidDate1 = "2023/12/31"; // Incorrect order
    const invalidDate2 = "12-31-2023"; // Incorrect separators
    const invalidDate3 = "12/31/2023"; // Incorrect year format
    expect(checkDateFormat(invalidDate1)).toBe(false);
    expect(checkDateFormat(invalidDate2)).toBe(false);
    expect(checkDateFormat(invalidDate3)).toBe(false);
  });

  it("should return false for an invalid date value", () => {
    const invalidDate = "13/32/23"; // Non-existent date
    expect(checkDateFormat(invalidDate)).toBe(false);
  });

  it("should return false for an empty string", () => {
    const emptyDate = ""; // Empty date string
    expect(checkDateFormat(emptyDate)).toBe(false);
  });
});
