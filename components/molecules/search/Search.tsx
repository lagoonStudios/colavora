import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import DropDownPicker, { LanguageType } from "react-native-dropdown-picker";

import { useColorScheme } from "@/components/useColorScheme";

import { SearchTheme } from "./Search.types";
import { styles } from "./Search.styles";
import { View } from "@components/Themed";
import { ViewStyle } from "react-native";
import { useSearchData } from "./Search.funcitons";
import { useNavigation, useRouter } from "expo-router";

// To create a custom theme, see the documentation template: https://github.com/hossein-zare/react-native-dropdown-picker/blob/5.x/src/themes/light/index.js
/**
 * Represents a search component that allows users to select an item from a list of options.
 *
 * @see {@link https://hossein-zare.github.io/react-native-dropdown-picker-website/docs | Documentation}
 */
export default function Search({
  containerStyle,
}: {
  containerStyle?: ViewStyle;
}) {
  // --- Hooks -----------------------------------------------------------------
  const router = useRouter();
  const theme = useColorScheme();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [pickerTheme, setPickerTheme] = useState<SearchTheme>("LIGHT");
  const { data, setData, loading, error, handleSearch } = useSearchData("");
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const handleSelectItem = (item: any) => {
    if (item["href"] != null) {
      const href: string = item["href"];
      router.push({ pathname: href, params: { shipmentID: item["value"] } });
    }
  };
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
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
  // --- END: Side effects -----------------------------------------------------

  return (
    <View style={[containerStyle, { zIndex: 100 }]}>
      <DropDownPicker
        open={open}
        value={value}
        items={data}
        searchable={true}
        loading={loading}
        theme={pickerTheme}
        setOpen={setOpen}
        setItems={setData}
        setValue={setValue}
        onChangeSearchText={handleSearch}
        onSelectItem={handleSelectItem}
        style={styles.search}
        dropDownContainerStyle={styles.dropdown}
        searchTextInputStyle={styles.searchTextInput}
        searchContainerStyle={styles.searchContainer}
        listItemContainerStyle={styles.listItemContainer}
        language={i18n.language.toUpperCase() as LanguageType}
      />
    </View>
  );
}
