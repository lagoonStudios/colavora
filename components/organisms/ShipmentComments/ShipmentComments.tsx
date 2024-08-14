import React from "react";
import OrderNotes from "@molecules/OrderNotes";
import OrderComments from "@molecules/OrderComments";

import { useCommentsData } from "./ShipmentComments.functions";
export default function ShipmentComments() {
  // --- Hooks -----------------------------------------------------------------
  const { data, loading } = useCommentsData();
  // --- END: Hooks ------------------------------------------------------------

  return (
    <>
      <OrderNotes notes={data?.notes} />
      <OrderComments comments={data?.comments} loading={loading} />
    </>
  );
}
