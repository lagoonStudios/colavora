import React from "react";
import { usePiecesData } from "./ShipmentPieces.functions";
import { IFetchPiecesByIdData } from "@constants/types/shipments";
import { FlatList } from "react-native";
import ShipmentPiecesItem from "@molecules/ShipmentPiecesItem";
import { ActivityIndicator } from "@components/Themed";
export default function ShipmentPieces() {
  // --- Hooks -----------------------------------------------------------------
  const { data, loading } = usePiecesData();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  // --- END: Local state ------------------------------------------------------

  // --- Refs ------------------------------------------------------------------
  // --- END: Refs -------------------------------------------------------------

  // --- Redux -----------------------------------------------------------------
  // --- END: Redux ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  // --- END: Side effects -----------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: IFetchPiecesByIdData }) => (
    <ShipmentPiecesItem {...item} />
  );
  // --- END: Data and handlers ------------------------------------------------

  return (
    <>
      {loading && <ActivityIndicator />}
      {!loading && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.pieceID)}
        />
      )}
    </>
  );
}
