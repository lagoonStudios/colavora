import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: "colavora",
  slug: "colavora",
  ...config,
  ios: {
    bundleIdentifier: "com.eagerlink.colavora",
    supportsTablet: true,
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY,
    },
  },
  android: {
    package: "com.eagerlink.colavora",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY,
      },
    },
  },
  plugins: [
    "expo-router",
    [
      "react-native-auth0",
      {
        domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN,
      },
    ],
  ],
});
