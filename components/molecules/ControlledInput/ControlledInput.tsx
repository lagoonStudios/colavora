import React, { useEffect, useMemo, useState } from "react";
import { TextInput as DefaultTextInput } from "react-native";
import { useController, UseControllerProps } from "react-hook-form";

import { useThemeColor, View, Text, ThemeProps } from "@components/Themed";
import { useColorScheme } from "@components/useColorScheme";
import { styles as defaultStyles } from "./ControlledInput.styles";

export type TextInputProps = ThemeProps &
  UseControllerProps &
  DefaultTextInput["props"] & {
    label?: string;
    optionalFirstComponent?: React.JSX.Element;
    backgroundColorContainer?: string;
    backgroundColorInput?: string;
  };

export default function ControlledInput(props: TextInputProps) {
  // --- Local state -----------------------------------------------------------
  const {
    lightColor,
    darkColor,
    name,
    rules,
    defaultValue,
    label,
    style,
    optionalFirstComponent,
    backgroundColorContainer,
    backgroundColorInput,
    ...otherProps
  } = props;
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  // --- END: Local state ------------------------------------------------------

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

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    const message = fieldState.error?.message;
    setErrorMessage(message);
  }, [fieldState.error]);
  // --- END: Side effects -----------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const optinalContainerStyles = useMemo(
    () =>
      backgroundColorContainer
        ? { backgroundColor: backgroundColorContainer, borderWidth: 0 }
        : undefined,
    [backgroundColorContainer],
  );
  const optinalInputStyles = useMemo(
    () =>
      backgroundColorInput
        ? { backgroundColor: backgroundColorInput }
        : undefined,
    [backgroundColorInput],
  );
  // --- END: Data and handlers ------------------------------------------------
  return (
    <View style={defaultStyles.container}>
      {label && <Text style={[defaultStyles.label]}>{label}</Text>}
      <View
        style={[
          defaultStyles.inputContainer,
          defaultStyles.inputShadow,
          optinalContainerStyles,
        ]}
      >
        {optionalFirstComponent}
        <DefaultTextInput
          ref={field.ref}
          style={[
            {
              backgroundColor,
              color: textColor,
              borderColor: textColor,
            },
            defaultStyles.input,
            style,
            optinalInputStyles,
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
