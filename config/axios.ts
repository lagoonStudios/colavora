import axios from "axios";
import { BASE_URL, API_KEY } from "@/constants/url";

const baseURL = BASE_URL;

export const axiosClient = axios.create({
  baseURL,
  headers: {
    ApiKey: API_KEY,
    "Access-Control-Allow-Origin": "*",
  },
});
