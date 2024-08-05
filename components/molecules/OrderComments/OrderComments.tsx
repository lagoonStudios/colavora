import React from "react";
import { ActivityIndicator, Text, View } from "@components/Themed";
import { IOrderNotes } from "./OrderComments.types";
import { styles } from "./OrderComments.styles";
import { FlatList } from "react-native";
export default function OrderComments({ comments, loading }: IOrderNotes) {
  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: string }) => {
    const splittedComment = item.split(")");
    const comment = splittedComment[1];
    const date = splittedComment[0].slice(1);

    return (
      <View style={styles.notesContainer}>
        <Text style={styles.bodyText}>{comment}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
    );
  };
  // --- END: Data and handlers ------------------------------------------------
  return (
    <>
      {loading && <ActivityIndicator />}
      {!loading && (
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item: string) => item.trim().toLowerCase()}
          style={styles.container}
        />
      )}
    </>
  );
}
