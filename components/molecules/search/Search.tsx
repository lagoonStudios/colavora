import { useTranslation } from "react-i18next";
import React from "react";

import { Text, useThemeColor, View } from "@components/Themed";
import { Pressable } from "react-native";
import { FormProvider, useForm } from "react-hook-form";
import { styles } from "./Search.styles";
import { SearchForm, SearchProps } from "./Search.types";
import TextInput from "@molecules/TextInput";

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
        <Text style={styles.leftIcon}>IC</Text>
        <Pressable style={styles.rightIcon} onPress={handleClose}>
          <Text>X</Text>
        </Pressable>
      </FormProvider>
    </View>
  );
}
