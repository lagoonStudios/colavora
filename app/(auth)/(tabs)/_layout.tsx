/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import Colors from "@constants/Colors";
import { useColorScheme } from "@components/useColorScheme";
import { useClientOnlyValue } from "@components/useClientOnlyValue";
import LoggedHeader from "@organisms/LoggedHeader";
import LogoutButton from "@molecules/LogoutButton/LogoutButton";
import { useThemeColor } from "@components/Themed";

import { useCompanyData, useDriverData } from "./tabs.functions";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  // --- Local state -----------------------------------------------------------
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  useDriverData();
  useCompanyData();
  const { t } = useTranslation();

  const colorScheme = useColorScheme();
  const { default: backgroundColor } = useThemeColor({}, "background");
  // --- END: Hooks ------------------------------------------------------------

  // --- Refs ------------------------------------------------------------------
  // --- END: Refs -------------------------------------------------------------

  // --- Redux -----------------------------------------------------------------
  // --- END: Redux ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  // --- END: Side effects -----------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  // --- END: Data and handlers ------------------------------------------------

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].text.shade,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarShowLabel: false,
          headerTitleStyle: { display: "none" },
          headerStyle: { height: 110, backgroundColor },
          tabBarStyle: { backgroundColor },
          tabBarIcon: ({ color }) => (
            <Feather
              name="home"
              size={28}
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
          headerRight: () => <LogoutButton />,
          headerLeft: () => <LoggedHeader />,
        }}
      />
      <Tabs.Screen
        name="manifests"
        options={{
          title: "Manifests",
          href: null,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: { backgroundColor },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="truck-fast-outline"
              size={28}
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ordersForToday"
        options={{
          title: "orderForToday",
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: { backgroundColor },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="truck-fast-outline"
              color={color}
              size={28}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { backgroundColor },
          tabBarIcon: ({ color }) => (
            <AntDesign
              name="user"
              color={color}
              size={28}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
