import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { ViewStyle } from "react-native";

export default function ArrowLeft(props: { styles?: ViewStyle }) {
  const { styles } = props;
  return <AntDesign styles={styles} name="left" size={25} color="black" />;
}
