import React from "react";

import { useThemeColor, View, ViewProps } from "@components/Themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeAreaView(props: ViewProps) {
  const { children } = props;
  // --- Hooks -----------------------------------------------------------------
  const insets = useSafeAreaInsets();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const { style, lightColor, darkColor, ...otherProps } = props;
  const { default: backgroundColor } = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundSecondary"
  );
  // --- END: Data and handlers ------------------------------------------------

  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor,
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </View>
  );
}
