/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  ActivityIndicator as DefaultActivityIndicator,
} from "react-native";
import React from "react";

import Colors from "@constants/Colors";
import { useColorScheme } from "./useColorScheme";

export interface ThemeProps {
  lightColor?: string;
  darkColor?: string;
}
export type Theme = {
  default: string;
  contrast: string;
  shade: string;
  tint: string;
};
export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type ActivityIndicatorProps = ThemeProps &
  DefaultActivityIndicator["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light
): Theme {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return {
      default: colorFromProps,
      contrast: colorFromProps,
      shade: colorFromProps,
      tint: colorFromProps,
    };
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const { tint: color } = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const { default: backgroundColor } = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ActivityIndicator(props: ActivityIndicatorProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const { default: color } = useThemeColor(
    { light: lightColor, dark: darkColor },
    "primary"
  );

  return (
    <DefaultActivityIndicator color={color} style={[style]} {...otherProps} />
  );
}
