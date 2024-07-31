import React, { useCallback } from "react";
import { Pressable } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useColorScheme } from "@components/useColorScheme";

import Colors from "@constants/Colors";
import useAuth from "@hooks/Auth";
// import { useAuth } from "@hooks/Auth";

export default function LogoutButton() {
  const colorScheme = useColorScheme();

  const { clearSession } = useAuth();

  const onPress = () => {
    try {
      clearSession();
    } catch (e) {
      console.log(e);
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
