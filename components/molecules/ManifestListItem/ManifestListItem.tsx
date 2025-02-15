import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Text, View, ActivityIndicator } from "@components/Themed";

import Card from "@atoms/Card";
import { useStore } from "@stores/zustand";
import { getShipmentList } from "@hooks/SQLite";
import { styles } from "./ManifestListItem.styles";
import { ManifestListItemProps } from "./ManifestListItem.types";

export default function ManifestListItem(props: ManifestListItemProps) {
  // --- Local state -----------------------------------------------------------
  const { manifest, active_shipments } = props;
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { addShipmentIds, addManifestId, setModalErrorModal } = useStore();
  const { push } = useRouter();
  // --- END: Hooks ------------------------------------------------------------

  // useEffect(() => {
  //   if (code && isSyncing === false) {
  //     getShipmentList({ manifestID: code })
  //       .then((values) => {
  //         setData(values);
  //       })
  //       .catch((error) => {
  //         console.error(
  //           "🚀 ~ file: ManifestListItem.tsx:32 ~ getShipmentList ~ error:",
  //           error
  //         );
  //       });
  //   }
  // }, [code, isSyncing]);

  // --- Data and handlers -----------------------------------------------------
  // const count = useMemo(() => {
  //   if (data && data?.length > 0) return data?.length;
  //   return undefined;
  // }, [data]);

  const setShipmentIdsHandler = useCallback(() => {
    getShipmentList({ manifestID: manifest })
      .then((values) => {
        addShipmentIds(values.map((shipment) => Number(shipment.shipmentID)));
        addManifestId(manifest);
        push("/OrdersList");
      })
      .catch((error) => {
        setModalErrorModal(`Error Shipment List: ${error}`);
        console.error(
          "🚀 ~ file: ManifestListItem.tsx:32 ~ getShipmentList ~ error:",
          error,
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addManifestId, addShipmentIds, manifest, push]);

  // --- END: Data and handlers ------------------------------------------------

  return (
    <>
      <View>
        <Pressable onPress={setShipmentIdsHandler}>
          <Card style={styles.container}>
            <FontAwesome name="list-ul" size={25} color="gray" />
            <View style={styles.descriptionContainer}>
              {manifest && (
                <Text style={styles.description}>{`${manifest}`}</Text>
              )}
              {!!active_shipments && (
                <Text
                  style={styles.count}
                >{`(${active_shipments ?? ""})`}</Text>
              )}
              {!active_shipments && <ActivityIndicator />}
            </View>
          </Card>
        </Pressable>
      </View>
    </>
  );
}
