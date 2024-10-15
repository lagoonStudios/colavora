import React from "react";
import { Pressable } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useColorScheme } from "@components/useColorScheme";

import Colors from "@constants/Colors";
import useAuth from "@hooks/Auth";
import { useStore } from "@stores/zustand";

export default function LogoutButton() {
  // --- Hooks -----------------------------------------------------------------
  const { clearSession } = useAuth();
  const colorScheme = useColorScheme();
  const { resetCompany, resetUser, resetShipment } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  const onPress = () => {
    try {
      clearSession();
      resetCompany();
      resetUser();
      resetShipment();
    } catch (e) {
      console.error("🚀 ~ LogoutButton ~ onPress ~ e:", e);
    }
  };

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <SimpleLineIcons
          name="login"
          size={25}
          color={Colors[colorScheme ?? "light"].text}
          style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
        />
      )}
    </Pressable>
  );
}
