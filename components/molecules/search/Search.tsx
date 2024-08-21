import React from "react";
import { Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

import Feather from "@expo/vector-icons/Feather";

import TextInput from "@molecules/TextInput";
import { useThemeColor, View } from "@components/Themed";

import { styles } from "./Search.styles";
import { SearchForm, SearchProps } from "./Search.types";

export default function Search(props: SearchProps) {
  const { containerStyle, setOpen, open, handleSearch } = props;
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { ...methods } = useForm<SearchForm>();

  const { default: backgroundColor } = useThemeColor({}, "background");
  const { name } = methods.register("search", {});
  // --- END: Hooks ------------------------------------------------------------
  // --- Refs ------------------------------------------------------------------

  // --- END: Refs -------------------------------------------------------------
  // --- Data and handlers -----------------------------------------------------
  const handleClose = () => {
    setOpen(false);
  };
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  // --- END: Side effects -----------------------------------------------------

  return (
    <View style={[containerStyle]}>
      <FormProvider {...methods}>
        <TextInput
          name={name}
          style={[styles.textInput, { backgroundColor }]}
          onChangeText={handleSearch}
          placeholder={t("SEARCH.PLACEHOLDER")}
        />
        <SimpleLineIcons
          name="magnifier"
          size={24}
          color="black"
          style={styles.leftIcon}
        />
        {open && (
          <Pressable style={styles.rightIcon} onPress={handleClose}>
            <Feather name="x" size={16} color="black" />
          </Pressable>
        )}
      </FormProvider>
    </View>
  );
}
