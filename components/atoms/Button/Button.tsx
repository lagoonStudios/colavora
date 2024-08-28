import React from "react";
import { Pressable, PressableProps, TextStyle, ViewStyle } from "react-native";

import { Text, ThemeProps, View, useThemeColor } from "@components/Themed";

import { styles } from "./Button.styles";
import Colors from "@constants/Colors";

type ButtonProps = ThemeProps &
  PressableProps & {
    label: string;
    labelStyle?: TextStyle;
    containerStyle?: ViewStyle;
    colorTheme?: keyof typeof Colors.light;
  };

export default function Button(props: ButtonProps) {
  const {
    style,
    lightColor,
    darkColor,
    label,
    labelStyle,
    containerStyle,
    disabled,
    colorTheme,
    ...otherProps
  } = props;
  const primaryColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorTheme ?? "primary"
  );
  return (
    <View style={[styles.container, styles.buttonShadow, containerStyle]}>
      <Pressable
        style={[
          {
            backgroundColor: primaryColor.default,
            opacity: disabled ? 0.5 : 1,
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
