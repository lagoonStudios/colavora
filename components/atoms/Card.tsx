import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ThemeProps, useThemeColor } from '../Themed';

interface CardProps extends ThemeProps {
  styles?: ViewStyle;
  children: React.ReactNode;
}

export default function Card(props: CardProps) {
  const { styles, children, lightColor, darkColor } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, defaultStyles.card, styles]}>{children}</View>;
}

const defaultStyles = StyleSheet.create({
  card: {
    borderRadius: 13,
    padding: 15,
  },
});
