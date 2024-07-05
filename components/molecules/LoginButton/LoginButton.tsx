import React from "react";
import { useAuth } from "@hooks/Auth";
import { Pressable } from "react-native";

export default function LoginButton() {
  const { authorize } = useAuth();

  const onPress = () => {
    try {
      authorize().then(console.log).catch(console.log);
    } catch (e) {
      console.log(e);
    }
  };

  return <Pressable onPress={onPress} />;
}
