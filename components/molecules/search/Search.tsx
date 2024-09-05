import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, Pressable, TextInput } from "react-native";
import { useForm } from "react-hook-form";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

import Feather from "@expo/vector-icons/Feather";

import { useThemeColor, View } from "@components/Themed";

import { styles } from "./Search.styles";
import { SearchForm, SearchProps } from "./Search.types";
import { styles as inputStyles } from "@molecules/ControlledInput/ControlledInput.styles";

export default function Search(props: SearchProps) {
  const { containerStyle, setOpen, open, handleSearch } = props;
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { ...methods } = useForm<SearchForm>();

  const { default: backgroundColor } = useThemeColor({}, "backgroundSecondary");
  const { name } = methods.register("search", {});
  const { tint: textColor } = useThemeColor({}, "text");
  // --- END: Hooks ------------------------------------------------------------
  // --- Refs ------------------------------------------------------------------
  const ref = useRef<TextInput>(null);
  // --- END: Refs -------------------------------------------------------------
  // --- Data and handlers -----------------------------------------------------
  const handleClose = () => {
    ref.current?.clear();
    Keyboard.dismiss();
    setOpen(false);
  };
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  // --- END: Side effects -----------------------------------------------------

  return (
    <View style={[containerStyle]}>
      <View style={inputStyles.container}>
        <View style={[inputStyles.inputContainer, inputStyles.inputShadow]}>
          <TextInput
            ref={ref}
            style={[
              inputStyles.input,
              {
                backgroundColor,
                color: textColor,
                borderColor: textColor,
              },
              styles.textInput,
            ]}
            onChangeText={handleSearch}
            placeholder={t("SEARCH.PLACEHOLDER")}
          />
        </View>
      </View>
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
    </View>
  );
}
