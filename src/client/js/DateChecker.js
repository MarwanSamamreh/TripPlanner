export function checkDateFormat(date) {
  // Regular expression to match MM/DD/YY format
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{2}$/;

  // Check if the date matches the regex
  if (!regex.test(date)) {
    return false;
  }

  // Extract the month, day, and year
  const [month, day, year] = date.split("/").map(Number);

  // Create a Date object using the parsed values
  const parsedDate = new Date(`20${year}`, month - 1, day);

  // Check if the date object matches the input date
  return parsedDate.getMonth() + 1 === month && parsedDate.getDate() === day;
}
