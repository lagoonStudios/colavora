import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Text,
  useThemeColor,
  View,
} from "@components/Themed";
import { FlatList, Pressable, ViewStyle } from "react-native";
import { useSearchData } from "./Search.funcitons";
import { Link, useRouter } from "expo-router";
import TextInput from "@molecules/TextInput";
import { FormProvider, useForm } from "react-hook-form";
import { styles } from "./Search.styles";

type SearchForm = {
  search: string;
};

export default function Search({
  containerStyle,
}: {
  containerStyle?: ViewStyle;
}) {
  // --- Hooks -----------------------------------------------------------------
  const router = useRouter();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const { ...methods } = useForm<SearchForm>();
  const [modalHeight, setModalHeight] = useState(0);
  const { data, setData, loading, handleSearch } = useSearchData("");
  const { default: backgroundColor } = useThemeColor({}, "background");
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------

  const handleModalHeight = (height: number) => setModalHeight(height);
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------

  // --- END: Side effects -----------------------------------------------------

  return (
    <FormProvider {...methods}>
      <View style={[styles.container, containerStyle]}>
        <TextInput
          name="Search"
          style={[styles.textInput, { backgroundColor }]}
          onChangeText={handleSearch}
          placeholder={t("SEARCH.PLACEHOLDER")}
          onFocus={() => setOpen(true)}
        />
        <Text style={styles.leftIcon}>IC</Text>
        <Text style={styles.rightIcon}>IC</Text>
        {open && (
          <View
            style={[
              styles.dataContainer,
              { backgroundColor, bottom: modalHeight * -1 },
            ]}
            onLayout={(ev) => handleModalHeight(ev.nativeEvent.layout.height)}
          >
            {loading && <ActivityIndicator />}
            {!loading && data.length == 0 && (
              <Text style={styles.containerLabel}>
                {t("SEARCH.NO_RESULTS")}
              </Text>
            )}
            {!loading && data.length > 0 && (
              <FlatList
                data={data}
                renderItem={({ item }) => (
                  <Link
                    href={{
                      pathname: "ShipmentDetails",
                      params: { shipmentID: item["value"] },
                    }}
                    style={[styles.listItemContainer]}
                    asChild
                  >
                    <Pressable>
                      <Text style={styles.contentText}>{item["label"]}</Text>
                    </Pressable>
                  </Link>
                )}
                ItemSeparatorComponent={() => (
                  <View style={styles.listItemSeparator} />
                )}
              />
            )}
          </View>
        )}
      </View>
    </FormProvider>
  );
}
