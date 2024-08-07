import { SearchItem } from "@organisms/SearchInput/SearchInput.types";
import { Dispatch, SetStateAction } from "react";
import { ViewStyle } from "react-native";

export type SearchProps = {
    containerStyle?: ViewStyle;
    setItems: Dispatch<SetStateAction<SearchItem[]>>;
    items: SearchItem[];
    setOpen: Dispatch<SetStateAction<boolean>>;
    open: boolean;
    handleSearch: (text: string) => void;
}


export type SearchForm = {
    search: string;
};

