import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStore } from "@stores/zustand";
import { useEffect } from "react";

export function useLastSync() {
  const { lastSyncDate, setLastSyncDate } = useStore();

  useEffect(() => {
    const getLastSync = async () => {
      try {
        const localLastSync = await AsyncStorage.getItem("lastSync");
        if (localLastSync != null) setLastSyncDate(localLastSync)
      } catch (e) {
        // error reading value
      }
    };

    getLastSync()
  }, [])

  useEffect(() => {
    if (lastSyncDate !== null)
      AsyncStorage.setItem("lastSync", lastSyncDate)

  }, [lastSyncDate])
}