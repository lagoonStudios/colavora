import { Link } from "expo-router";
import { Pressable } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { Text, View, ActivityIndicator } from "@components/Themed";

import Card from "@atoms/Card";
import { useStore } from "@stores/zustand";
import { getShipmentList } from "@hooks/SQLite";
import { styles } from "./ManifestListItem.styles";
import { ManifestListItemProps } from "./ManifestListItem.types";
import { IFetchOrderListItem } from "@hooks/SQLite/SQLite.types";

export default function ManifestListItem(props: ManifestListItemProps) {
  // --- Local state -----------------------------------------------------------
  const { code } = props;
  const [data, setData] = useState<IFetchOrderListItem[]>();
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { addShipmentIds } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  useEffect(() => {
    if (code) {
      getShipmentList({ manifestID: code }).then((values) => {
        setData(values)
      })
    }
  }, [code])

  // --- Data and handlers -----------------------------------------------------
  const count = useMemo(() => {
    if (data && data?.length > 0) return data?.length;
    return undefined;
  }, [data]);

  const setShipmentIdsHandler = useCallback(() => {
    if (data) addShipmentIds(data?.map((shipment) => Number(shipment.shipmentID)));
  }, [data]);

  // --- END: Data and handlers ------------------------------------------------

  return <>
    {data?.length !== 0 && <Link href={"/OrdersList"} asChild>
      <Pressable onPress={setShipmentIdsHandler}>
        <Card style={styles.container}>
          <FontAwesome name="list-ul" size={25} color="gray" />
          <View style={styles.descriptionContainer}>
            {code && <Text style={styles.description}>{`${code}`}</Text>}
            {!!count && <Text style={styles.count}>{`(${count ?? ""})`}</Text>}
            {!count && <ActivityIndicator />}
          </View>
        </Card>
      </Pressable>
    </Link>}
  </>
}
