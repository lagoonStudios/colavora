export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL ?? "";
export const API_KEY = process.env.EXPO_PUBLIC_API_KEY ?? "";
export const AUTH0_CLIENT_ID = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID ?? "";
export const TEST_TIME = process.env.EXPO_PUBLIC_TEST_TIME
  ? Number(process.env.EXPO_PUBLIC_TEST_TIME)
  : 0;
export const AUTH0_DOMAIN = process.env.EXPO_PUBLIC_AUTH0_DOMAIN
  ? "https://" + process.env.EXPO_PUBLIC_AUTH0_DOMAIN
  : "";
