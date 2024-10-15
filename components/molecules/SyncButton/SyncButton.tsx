/* eslint-disable react/react-in-jsx-scope */
import Button from "@atoms/Button";
import { Alert, View } from "react-native";
import { useStore } from "@stores/zustand";
import Toast from "react-native-root-toast";
import { resetDatabase } from "@hooks/SQLite";
import { useTranslation } from "react-i18next";
import { Text, useThemeColor } from "@components/Themed";
import { useColorScheme } from "@components/useColorScheme";
import { useIsConnected } from "react-native-offline";
import { useState } from "react";
import { generalDate } from "@constants/Constants";
import { parserGeneralDate } from "@utils/functions";

export default function SyncButton() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { setVisible, setModal, user, setSyncing, isSyncing } = useStore();
  const theme = useThemeColor({}, "primary");
  const colorScheme = useColorScheme();
  const isConnected = useIsConnected();
  const [disableActions, setDisableActions] = useState(false);
  // --- END: Hooks ------------------------------------------------------------

  // --- Local State ------------------------------------------------------------
  const createdDate = parserGeneralDate(generalDate)?.split(".")[0];
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
                .then(() => {
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
    <View>
      <Text style={{ fontSize: 9, textAlign: "right" }}>{createdDate}</Text>
      <Text style={{ fontSize: 9, textAlign: "right" }}>{user?.companyID}</Text>
      <Text style={{ fontSize: 9, textAlign: "right" }}>{user?.driverID}</Text>
      <Button
        disabled={disableActions}
        onPress={handleClearCache}
        label={t("SYNC_BUTTON.TITLE")}
        style={{ backgroundColor: theme.default }}
        labelStyle={{ color: theme.contrast }}
      />
    </View>
  );
}
