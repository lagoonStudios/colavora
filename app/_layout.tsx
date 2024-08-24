import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";
import "@/lang/i18n";
import { RootSiblingParent } from "react-native-root-siblings";

import { useColorScheme } from "@components/useColorScheme";
import AuthProvider from "@/providers/Auth";
import { useAuth0Config } from "@hooks/Auth";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { queryClient } from "@/providers";
import { StateModal } from "@atoms/Modal";
import { useDefaultLanguage } from "@hooks/index";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

void SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  // --- Hooks -----------------------------------------------------------------
  const [fontsLoaded, fontsError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const {
    loaded: authLoaded,
    error: authError,
    domain: authDomain,
    clientId: authClientId,
  } = useAuth0Config();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  // --- END: Local state ------------------------------------------------------

  // --- Refs ------------------------------------------------------------------
  // --- END: Refs -------------------------------------------------------------

  // --- Redux -----------------------------------------------------------------
  // --- END: Redux ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (fontsError) throw fontsError;
    if (authError) throw authError;
  }, [fontsError, authError]);

  useEffect(() => {
    if (fontsLoaded && authLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authLoaded]);
  // --- END: Side effects -----------------------------------------------------

  if (!fontsLoaded || !authLoaded) {
    return null;
  }

  return <RootLayoutNav authDomain={authDomain} authClientId={authClientId} />;
}

function RootLayoutNav(props: { authDomain: string; authClientId: string }) {
  // --- Hooks -----------------------------------------------------------------
  // Set a defalut language stored in the async storage
  useDefaultLanguage();
  const colorScheme = useColorScheme();
  const { authDomain, authClientId } = props;
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  // --- END: Local state ------------------------------------------------------

  // --- Refs ------------------------------------------------------------------
  // --- END: Refs -------------------------------------------------------------

  // --- Redux -----------------------------------------------------------------
  // --- END: Redux ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  // --- END: Side effects -----------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  // --- END: Data and handlers ------------------------------------------------

  return (
    <QueryClientProvider client={queryClient}>
      <RootSiblingParent>
        <SafeAreaProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <AuthProvider domain={authDomain} clientId={authClientId}>
              <StateModal />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(no-auth)" />
                <Stack.Screen name="(auth)" />
              </Stack>
            </AuthProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </RootSiblingParent>
    </QueryClientProvider>
  );
}
