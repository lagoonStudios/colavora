import React, { useCallback, useMemo } from "react";
import Card from "@atoms/Card";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { Text, View, ActivityIndicator } from "@components/Themed";

import { styles } from "./ManifestListItem.styles";
import { ManifestListItemProps } from "./ManifestListItem.types";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { useShipmentsIdData } from "@hooks/queries";
import { useStore } from "@stores/zustand";

export default function ManifestListItem(props: ManifestListItemProps) {
  // --- Local state -----------------------------------------------------------
  const { code } = props;
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { data } = useShipmentsIdData({ manifest: code });
  const { addShipmentIds } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const count = useMemo(() => {
    if (data) return data?.length;
    return undefined;
  }, [data]);

  const setShipmentIdsHandler = useCallback(() => {
    if (data) addShipmentIds(data);
  }, [addShipmentIds, data]);

  // --- END: Data and handlers ------------------------------------------------

  return (
    <Link href={"/OrdersList"} asChild>
      <Pressable onPress={setShipmentIdsHandler}>
        <Card style={styles.container}>
          <FontAwesome name="list-ul" size={25} color="gray" />
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{`${code}`}</Text>
            {count && <Text style={styles.count}>{`(${count})`}</Text>}
            {!count && <ActivityIndicator />}
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}
