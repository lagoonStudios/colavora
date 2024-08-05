import React from "react";
import { useCommentsData } from "./ShipmentComments.functions";
import OrderNotes from "@molecules/OrderNotes";
import AddComment from "@molecules/AddComment";
import OrderComments from "@molecules/OrderComments";
export default function ShipmentComments() {
  // --- Hooks -----------------------------------------------------------------
  const { data, refetch, loading } = useCommentsData();
  // --- END: Hooks ------------------------------------------------------------

  return (
    <>
      <OrderNotes notes={data?.notes} />
      <AddComment refetch={refetch} />
      <OrderComments comments={data?.comments} loading={loading} />
    </>
  );
}
