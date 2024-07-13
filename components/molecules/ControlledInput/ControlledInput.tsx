import React, { useEffect, useState } from "react";
import { useController, UseControllerProps } from "react-hook-form";
import { useThemeColor, View, Text, ThemeProps } from "@components/Themed";
import { useColorScheme } from "@components/useColorScheme";
import { TextInput as DefaultTextInput } from "react-native";
import { styles as defaultStyles } from "./ControlledInput.styles";

export type TextInputProps = ThemeProps &
  UseControllerProps &
  DefaultTextInput["props"] & {
    label?: string;
  };

export default function ControlledInput(props: TextInputProps) {
  const {
    lightColor,
    darkColor,
    name,
    rules,
    defaultValue,
    label,
    style,
    ...otherProps
  } = props;
  // --- Hooks -----------------------------------------------------------------
  const { field, fieldState } = useController({ name, rules, defaultValue });

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
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  // --- END: Local state ------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    const message = fieldState.error?.message;
    setErrorMessage(message);
  }, [fieldState.error]);
  // --- END: Side effects -----------------------------------------------------
  return (
    <View style={defaultStyles.container}>
      {label && <Text style={[defaultStyles.label]}>{label}</Text>}
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
          keyboardAppearance={theme}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          {...otherProps}
        />
      </View>
      {errorMessage && (
        <Text style={[{ color: errorColor }, defaultStyles.error]}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
}
