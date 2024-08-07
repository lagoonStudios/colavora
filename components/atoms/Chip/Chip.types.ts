import { ViewStyle } from "react-native";

export type ChipProps = {
  label: string;
  onPress?: () => void;
  styles?: ViewStyle;
  labelStyles?: ViewStyle;
  active?: boolean;
};
