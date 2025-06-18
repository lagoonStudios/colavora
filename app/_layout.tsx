import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import React, { Suspense, useEffect } from "react";
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

import { StateModal, ErrorModal } from "@atoms/Modal";
import { queryClient } from "@/providers";
import AuthProvider from "@/providers/Auth";
import { useAuth0Config } from "@hooks/Auth";
import { useDefaultLanguage } from "@hooks/index";
import { NetworkProvider } from "react-native-offline";
import { useColorScheme } from "@components/useColorScheme";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SQLiteProvider } from "expo-sqlite";
import migrations from "@/drizzle/migrations";
import { ActivityIndicator } from "react-native";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { db, expoDb, useMigrations } from "@/db";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export const DATABASE_NAME = "colavora";

void SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  // --- Hooks -----------------------------------------------------------------
  // Local db initialization
  const { success: migrationSuccess, error: migrationError } = useMigrations(
    db,
    migrations
  );
  useDrizzleStudio(expoDb);

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

  // --- Side effects ----------------------------------------------------------

  useEffect(() => {
    if (migrationSuccess) {
      console.log("🚀 ~ RootLayout ~ migrationSuccess:", migrationSuccess);
    }
    if (migrationError) {
      console.log("🚀 ~ RootLayout ~ migrationError:", migrationError);
    }
  }, [migrationSuccess, migrationError]);

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

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <NetworkProvider>
          <QueryClientProvider client={queryClient}>
            <RootSiblingParent>
              <SafeAreaProvider>
                <ThemeProvider
                  value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                  <AuthProvider domain={authDomain} clientId={authClientId}>
                    <StateModal />
                    <ErrorModal />
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="(no-auth)" />
                      <Stack.Screen name="(auth)" />
                    </Stack>
                  </AuthProvider>
                </ThemeProvider>
              </SafeAreaProvider>
            </RootSiblingParent>
          </QueryClientProvider>
        </NetworkProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
