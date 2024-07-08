import React from "react";
import { Pressable, PressableProps, TextStyle } from "react-native";
import { styles } from "./Button.styles";
import { Text, ThemeProps, useThemeColor } from "@components/Themed";

type ButtonProps = ThemeProps &
  PressableProps & {
    label: string;
    labelStyle?: TextStyle;
  };

export default function Button(props: ButtonProps) {
  const { style, lightColor, darkColor, label, labelStyle } = props;
  const primaryColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "primary",
  );
  return (
    <Pressable
      style={[
        {
          backgroundColor: primaryColor,
        },
        styles.button,
      ]}
    >
      <Text style={styles.label}>Button</Text>
    </Pressable>
  );
}
