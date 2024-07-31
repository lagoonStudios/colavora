/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useEffect, useState } from "react";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";

import Colors from "@constants/Colors";
import { useColorScheme } from "@components/useColorScheme";
import { useClientOnlyValue } from "@components/useClientOnlyValue";
import LoggedHeader from "@organisms/LoggedHeader";
import LogoutButton from "@molecules/LogoutButton/LogoutButton";
import { useThemeColor } from "@components/Themed";

import { useDriverData, useCompanyData } from "@hooks/index";
import { IFetchDriverData } from "@constants/types";

export default function TabLayout() {
  // --- Local state -----------------------------------------------------------
  const [driverData, setDriverData] = useState<IFetchDriverData>();
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  useCompanyData(driverData?.companyID);

  const colorScheme = useColorScheme();
  const { data: responseDriverData } = useDriverData("1");
  const { default: backgroundColor } = useThemeColor({}, "background");
  // --- END: Hooks ------------------------------------------------------------

  // --- Refs ------------------------------------------------------------------
  // --- END: Refs -------------------------------------------------------------

  // --- Redux -----------------------------------------------------------------
  // --- END: Redux ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (responseDriverData) setDriverData(responseDriverData);
  }, [responseDriverData]);
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
            <FontAwesome
              name="home"
              color={color}
              size={28}
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
          title: "Profile",
          tabBarShowLabel: false,
          headerStyle: { height: 110, backgroundColor },
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
