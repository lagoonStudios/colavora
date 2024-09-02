import { useCallback } from "react";
import { useStore } from "@stores/zustand";
import Toast from "react-native-root-toast";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";

import { Text, useThemeColor, View } from "@components/Themed";

import { styles } from "./SyncPeriodSelector.styles";
import { SyncPeriod } from "@constants/types/general";

const Periods: SyncPeriod[] = [5, 10, 20, 30, 60];

export default function SyncPeriodSelector() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { syncPeriod, setSyncPeriod } = useStore();
  const { default: backgroundColor } = useThemeColor({}, "backgroundSecondary");
  const { default: border } = useThemeColor({}, "gray");
  // --- END: Hooks ------------------------------------------------------------
  // --- Data and handlers -----------------------------------------------------
  const handleChange = useCallback((value: SyncPeriod, ind: number) => {
    setSyncPeriod(value);
    Toast.show(t("SYNC_BUTTON.SYNC_PERIOD_CHANGED", { period: value }));
  }, []);
  // --- END: Data and handlers ------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("SYNC_BUTTON.SYNC_PERIOD_SELECTOR")}</Text>
      <Picker
        selectedValue={syncPeriod}
        onValueChange={handleChange}
        style={{
          backgroundColor,
          borderWidth: 1,
          borderColor: border,
        }}
      >
        {Periods.map((p) => (
          <Picker.Item label={String(p)} value={p} key={p} />
        ))}
      </Picker>
    </View>
  );
}
