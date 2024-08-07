import { View, Text } from "@components/Themed";
import React from "react";
import { styles } from "./ShipmentPiecesItem.styles";
import { IFetchPiecesByIdData } from "@constants/types";

export default function ShipmentPiecesItem({
  barcode,
  comments,
  packageTypeName,
}: IFetchPiecesByIdData) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.bodyText}>{barcode}</Text>
        <Text style={styles.bodyText}>{packageTypeName}</Text>
      </View>
      <View>
        <Text style={styles.bodyText}>{comments}</Text>
      </View>
    </View>
  );
}
