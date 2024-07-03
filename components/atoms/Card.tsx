import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { ThemeProps, useThemeColor } from "../Themed";

interface CardProps extends ThemeProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

export default function Card(props: CardProps) {
  const { style, children, lightColor, darkColor } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  return <View style={[defaultStyles.card, { backgroundColor }, style]}>{children}</View>;
}

const defaultStyles = StyleSheet.create({
  card: {
    borderRadius: 13,
    padding: 15,
  },
});
