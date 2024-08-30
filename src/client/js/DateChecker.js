// src/client/js/DateChecker.js

export function checkDateFormat(date) {
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{2}$/;
  return regex.test(date);
}
