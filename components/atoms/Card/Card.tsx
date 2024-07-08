import React from "react";

import { View, ViewProps, useThemeColor } from "../../Themed";

import { styles as defaultStyles } from "./Card.styles";

export default function Card(props: ViewProps) {
  const { style, children, lightColor, darkColor } = props;
  const { default: backgroundColor } = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  return (
    <View style={[defaultStyles.card, { backgroundColor }, style]}>
      {children}
    </View>
  );
}
