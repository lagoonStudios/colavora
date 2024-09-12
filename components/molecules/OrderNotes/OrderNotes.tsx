import React, { useMemo } from "react";
import { Text, View } from "@components/Themed";
import { IOrderNotes } from "./OrderNotes.types";
import { styles } from "./OrderNotes.styles";
import { useTranslation } from "react-i18next";
export default function OrderNotes({ notes }: IOrderNotes) {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------
  // --- Data and handlers -----------------------------------------------------
  const orderNotesContent = useMemo(() => {
    return notes?.comment && notes?.comment.replace(" Order Notes:", "");
  }, [notes]);
  // --- END: Data and handlers ------------------------------------------------

  return (
    <View style={styles.container}>
      <Text style={styles.noteTitle}>{t("COMMENTS.ORDERS")}</Text>
      <View style={styles.notesContainer}>
        <Text style={styles.bodyText}>
          {orderNotesContent ?? t("COMMENTS.NO_NOTES")}
        </Text>
      </View>
    </View>
  );
}
