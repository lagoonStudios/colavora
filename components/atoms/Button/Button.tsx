import React, { Children } from "react";
import { Pressable, PressableProps, TextStyle, ViewStyle } from "react-native";

import { Text, ThemeProps, View, useThemeColor } from "@components/Themed";

import { styles } from "./Button.styles";
import Colors from "@constants/Colors";

type ButtonProps = ThemeProps &
  PressableProps & {
    label: string;
    labelStyle?: TextStyle;
    containerStyle?: ViewStyle;
    children?: React.ReactNode;
  };

export default function Button(props: ButtonProps) {
  const {
    style,
    lightColor,
    darkColor,
    label,
    labelStyle,
    containerStyle,
    children,
    disabled,
    ...otherProps
  } = props;
  const primaryColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "primary",
  );
  return (
    <View style={[styles.container, containerStyle]}>
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
        {children ? (
          children
        ) : (
          <Text
            style={[{ color: primaryColor.contrast }, styles.label, labelStyle]}
          >
            {label}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
