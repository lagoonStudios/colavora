import { useCODFetch } from "./COD";
import { useCommentsFetch } from "./comments";
import { useCompanyFetch } from "./company";
import { useDriverFetch } from "./user";
import { useManifestFetch } from "./manifest";
import { usePiecesFetch } from "./pieces";
import { useReasonsFetch } from "./reasons";
import { useShipmentFetch } from "./shipment";

export function useSyncData() {
  // --- Hooks -----------------------------------------------------------------
  useCODFetch();
  useDriverFetch();
  useReasonsFetch();
  useCompanyFetch();
  useManifestFetch();
  useShipmentFetch();
  useCommentsFetch();
  usePiecesFetch();
  // --- END: Hooks ------------------------------------------------------------

  return;
}