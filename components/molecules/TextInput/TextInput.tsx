import React from "react";
import { TextInput as DefaultTextInput, TextStyle } from "react-native";

import { useThemeColor } from "@components/Themed";
import { useColorScheme } from "@components/useColorScheme";
import { Text, ThemeProps, View } from "@components/Themed";

import { styles as defaultStyles } from "./TextInput.styles";

export type TextInputProps = ThemeProps &
  DefaultTextInput["props"] & {
    label?: string;
    labelStyle?: TextStyle;
    errorText?: string;
    errorStyle?: TextStyle;
  };

export default function TextInput(props: TextInputProps) {
  const {
    style,
    lightColor,
    darkColor,
    label,
    labelStyle,
    errorText,
    errorStyle,
    ...otherProps
  } = props;
  const { default: backgroundColor } = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );
  const { tint: textColor } = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text",
  );
  const { tint: errorColor } = useThemeColor(
    { light: lightColor, dark: darkColor },
    "danger",
  );
  const theme = useColorScheme() ?? "light";

  return (
    <View style={defaultStyles.container}>
      {label && <Text style={[labelStyle, defaultStyles.label]}>{label}</Text>}
      <View style={[defaultStyles.inputContainer, defaultStyles.inputShadow]}>
        <DefaultTextInput
          style={[
            {
              backgroundColor,
              color: textColor,
              borderColor: textColor,
            },
            defaultStyles.input,
            style,
          ]}
          {...otherProps}
          keyboardAppearance={theme}
        />
      </View>
      {errorText && (
        <Text style={[{ color: errorColor }, defaultStyles.error, errorStyle]}>
          {errorText}
        </Text>
      )}
    </View>
  );
}
