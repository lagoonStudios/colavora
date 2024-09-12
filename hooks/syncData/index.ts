import { useCODFetch } from "./COD";
import { useDataFetch } from "./data";
import { useReasonsFetch } from "./reasons";
import { useStore } from "@stores/zustand";

export function useSyncData() {
  // --- Hooks -----------------------------------------------------------------
  const { user } = useStore();

  useCODFetch(user);
  useReasonsFetch(user);
  useDataFetch(user);
  // --- END: Hooks ------------------------------------------------------------

  return;
}
