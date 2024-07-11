import React from "react";
import { Pressable, PressableProps, TextStyle, ViewStyle } from "react-native";

import { Text, ThemeProps, View, useThemeColor } from "@components/Themed";

import { styles } from "./Button.styles";

type ButtonProps = ThemeProps &
  PressableProps & {
    label: string;
    labelStyle?: TextStyle;
    containerStyle?: ViewStyle;
  };

export default function Button(props: ButtonProps) {
  const {
    style,
    lightColor,
    darkColor,
    label,
    labelStyle,
    containerStyle,
    ...otherProps
  } = props;
  const primaryColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "primary"
  );
  return (
    <View style={[styles.container, styles.buttonShadow, containerStyle]}>
      <Pressable
        style={[
          {
            backgroundColor: primaryColor.default,
          },
          styles.button,
          styles.buttonShadow,
          style,
        ]}
        {...otherProps}
      >
        <Text
          style={[{ color: primaryColor.contrast }, styles.label, labelStyle]}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}
