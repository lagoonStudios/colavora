import React from "react";
import { useCommentsData } from "./ShipmentComments.functions";
import { SafeAreaView } from "@atoms/SafeAreaView";
import OrderNotes from "@molecules/OrderNotes";
import { styles } from "./ShipmentComments.styles";
import AddComment from "@molecules/AddComment";
export default function ShipmentComments() {
  // --- Hooks -----------------------------------------------------------------
  const { data, refetch } = useCommentsData();
  // --- END: Hooks ------------------------------------------------------------

  console.log(data);

  return (
    <SafeAreaView style={styles.container}>
      <OrderNotes notes={data?.notes} />
      <AddComment refetch={refetch} />
    </SafeAreaView>
  );
}
