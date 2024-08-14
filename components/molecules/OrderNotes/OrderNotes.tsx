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
    return notes?.replace(" Order Notes:", "");
  }, [notes]);
  // --- END: Data and handlers ------------------------------------------------

  return (
    <View style={styles.container}>
      <Text style={styles.noteTitle}>{t("COMMENTS.ORDERS")}</Text>
      <View style={styles.notesContainer}>
        <Text style={styles.bodyText}>{orderNotesContent}</Text>
      </View>
    </View>
  );
}
