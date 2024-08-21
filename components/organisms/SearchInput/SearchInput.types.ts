import { Dispatch, ReactNode, SetStateAction } from "react";
import { ViewStyle } from "react-native";

export type SearchInputProps = {
    children: ReactNode;
    style?: ViewStyle;
};


export type SearchItem = {
    label: string;
    value: string;
}

export type UseSearchDataProps = {
    text: string;
};