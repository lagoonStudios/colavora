import { ViewStyle } from "react-native";

export type ChipProps = {
    label: string;
    onPress?: () => void;
    styles?: ViewStyle;
    active?: boolean;
};