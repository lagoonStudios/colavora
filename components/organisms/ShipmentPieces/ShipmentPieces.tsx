import React from "react";
import { usePiecesData } from "./ShipmentPieces.functions";
import { IFetchPiecesByIdData } from "@constants/types/shipments";
import { FlatList } from "react-native";
import ShipmentPiecesItem from "@molecules/ShipmentPiecesItem";
import { ActivityIndicator, View } from "@components/Themed";
import { styles } from "./ShipmentPieces.styles";
export default function ShipmentPieces() {
  // --- Hooks -----------------------------------------------------------------
  const { data, loading } = usePiecesData();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: IFetchPiecesByIdData }) => (
    <ShipmentPiecesItem {...item} />
  );
  // --- END: Data and handlers ------------------------------------------------

  return (
    <View style={styles.content}>
      {loading && <ActivityIndicator />}
      {!loading && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.pieceID)}
        />
      )}
    </View>
  );
}
