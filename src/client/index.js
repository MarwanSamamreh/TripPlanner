import { handleSubmit, populateForm } from "./js/FormHandler.js";
import "./styles/style.scss";

// Add event listener to the form
document
  .getElementById("travel-form")
  ?.addEventListener("submit", handleSubmit);
