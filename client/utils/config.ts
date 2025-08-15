//show TS the Vite Env Variables
/// <reference types="vite/client" />


export const BASE_URL =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_API_BASE_URL : "https://grocerylistserver.azurewebsites.net/api";
