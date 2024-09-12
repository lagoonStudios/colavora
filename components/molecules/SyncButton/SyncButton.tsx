import Button from "@atoms/Button";
import { Alert } from "react-native";
import { useStore } from "@stores/zustand";
import Toast from "react-native-root-toast";
import { resetDatabase } from "@hooks/SQLite";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@components/Themed";
import { useColorScheme } from "@components/useColorScheme";
import { useIsConnected } from "react-native-offline";
import { useState } from "react";

export default function SyncButton() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { setVisible, setModal, user, setSyncing, isSyncing } = useStore();
  const theme = useThemeColor({}, "primary");
  const colorScheme = useColorScheme();
  const isConnected = useIsConnected();
  const [disableActions, setDisableActions] = useState(false);
  // --- END: Hooks ------------------------------------------------------------
  // --- Data and handlers -----------------------------------------------------
  const handleClearCache = () => {
    if (!isConnected) {
      Alert.alert(t("NETWORK_ERROR.TITLE"), t("NETWORK_ERROR.DESCRIPTION"));
      return;
    }

    Alert.alert(
      t("SYNC_BUTTON.TITLE"),
      t("SYNC_BUTTON.DESCRIPTION"),
      [
        {
          text: t("COMMON.CANCEL"),
          style: "cancel",
        },
        {
          text: t("COMMON.ACCEPT"),
          onPress: () => {
            if (isSyncing) return;
            setModal(t("SYNC_BUTTON.CLEANING"));
            setSyncing(true);
            if (user) {
              setDisableActions(true);
              resetDatabase(user, { t, setModalMessage: setModal })
                .then((res) => {
                  setDisableActions(false);
                  setVisible(false);
                  Toast.show(t("SYNC_BUTTON.SUCCESS"));
                  setSyncing(false);
                })
                .catch((error) => {
                  setDisableActions(false);
                  setVisible(false);
                  Toast.show(t("SYNC_BUTTON.ERROR"));
                  console.error(
                    "🚀 ~ file: SyncButton.tsx:26 ~ resetDatabase ~ error:",
                    error,
                  );
                  setSyncing(false);
                });
            }
          },
        },
      ],
      {
        cancelable: true,
        userInterfaceStyle: colorScheme ? colorScheme : "light",
      },
    );
  };
  // --- END: Data and handlers ------------------------------------------------
  return (
    <Button
      disabled={disableActions}
      onPress={handleClearCache}
      label={t("SYNC_BUTTON.TITLE")}
      style={{ backgroundColor: theme.default }}
      labelStyle={{ color: theme.contrast }}
    />
  );
}
