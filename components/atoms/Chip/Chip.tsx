import React from "react";
import { Pressable } from "react-native";

import { Text, useThemeColor } from "@components/Themed";

import { ChipProps } from "./Chip.types";
import { styles as defaultStyles } from "./Chip.styles";

export default function Chip(props: ChipProps) {
  // --- Hooks -----------------------------------------------------------------
  const { label, onPress, styles, active } = props;
  const { default: activeBackgroundColor, contrast: activeTextColor } =
    useThemeColor({}, "primary");

  const { default: inActiveTextColor, contrast: inActiveBackgroundColor } =
    useThemeColor({}, "noStatus");

  // --- END: Hooks ------------------------------------------------------------
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles,
        defaultStyles.container,
        active
          ? { backgroundColor: activeBackgroundColor }
          : {
              backgroundColor: inActiveBackgroundColor,
            },
        active ? defaultStyles.active : defaultStyles.inactive,
      ]}
    >
      <Text
        adjustsFontSizeToFit={true}
        numberOfLines={1}
        style={[
          defaultStyles.label,
          active ? { color: activeTextColor } : { color: inActiveTextColor },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
