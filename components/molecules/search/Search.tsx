import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import DropDownPicker, { LanguageType } from "react-native-dropdown-picker";

import { useColorScheme } from "@/components/useColorScheme";

import { SearchProps, SearchTheme } from "./search.types";

// To create a custom theme, see the documentation template: https://github.com/hossein-zare/react-native-dropdown-picker/blob/5.x/src/themes/light/index.js
/**
 * Represents a search component that allows users to select an item from a list of options.
 *
 * @see {@link https://hossein-zare.github.io/react-native-dropdown-picker-website/docs | Documentation}
 */
export default function Search(props: SearchProps) {
  const { ...otherProps } = props;
  const { i18n } = useTranslation();
  const theme = useColorScheme();
  const [pickerTheme, setPickerTheme] = useState<SearchTheme>("LIGHT");

  useEffect(() => {
    switch (theme) {
      case "dark":
        setPickerTheme("DARK");
        break;
      default:
        setPickerTheme("LIGHT");
        break;
    }
  }, [theme]);

  return (
    <DropDownPicker
      {...otherProps}
      language={i18n.language.toUpperCase() as LanguageType}
      theme={pickerTheme}
    />
  );
}
