import { useCODFetch } from "./COD";
import { useCompanyFetch } from "./company";
import { useDriverFetch } from "./user";
import { useDataFetch } from "./data";
import { useReasonsFetch } from "./reasons";
import { useStore } from "@stores/zustand";

export function useSyncData() {
  // --- Hooks -----------------------------------------------------------------
  const { user } = useStore();

  useDriverFetch();
  useCompanyFetch();
  
  useCODFetch(user);
  useReasonsFetch(user);
  useDataFetch(user);
  // --- END: Hooks ------------------------------------------------------------

  return;
}