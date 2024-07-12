import React from "react";
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

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { default: backgroundColor } = useThemeColor({}, "background");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
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
          headerStyle: { height: 110, backgroundColor },
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
