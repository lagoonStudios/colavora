import React from "react";
import { ActivityIndicator, Text, View } from "@components/Themed";
import { IOrderNotes } from "./OrderComments.types";
import { styles } from "./OrderComments.styles";
import { FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import { IOptionalCommentsProps } from "@constants/types/shipments";
export default function OrderComments({ comments, loading }: IOrderNotes) {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: Pick<IOptionalCommentsProps, "shipmentID" | "comment" | "createdDate"> }) => {
    return (
      <View style={styles.notesContainer}>
        <Text style={styles.bodyText}>{item.comment}</Text>
        {item.createdDate && <Text style={styles.dateText}>{item.createdDate}</Text>}
      </View>
    );
  };
  // --- END: Data and handlers ------------------------------------------------
  return (
    <View>
      {loading && <ActivityIndicator />}
      {!loading && (
        <>
          <View style={styles.secondaryContainer}>
            <Text style={styles.noteTitle}>{t("COMMENTS.COMMENTS")}</Text>
          </View>
          <FlatList
            data={comments}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.comment.trim().toLowerCase())}
            style={styles.container}
          />
        </>
      )}
    </View>
  );
}
