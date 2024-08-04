import { create } from "zustand";
import {
  createManifestIdsSlice,
  createManifestsSlice,
  ManifestIdsSlice,
  ManifestsSlice,
} from "./manifests";
import {
  createShipmentIdsSlice,
  createShipmentSlice,
  createPiecesIdsSlice,
  createPiecesSlice,
  createCommentsSlice,
  PiecesIdsSlice,
  PiecesSlice,
  ShipmentIdsSlice,
  ShipmentSlice,
  CommentsSlice,
} from "./shipments";

const useBoundStore = create<
  ManifestIdsSlice &
    ManifestsSlice &
    ShipmentIdsSlice &
    ShipmentSlice &
    PiecesIdsSlice &
    PiecesSlice &
    CommentsSlice
>()((...a) => ({
  ...createManifestIdsSlice(...a),
  ...createManifestsSlice(...a),
  ...createShipmentIdsSlice(...a),
  ...createShipmentSlice(...a),
  ...createPiecesIdsSlice(...a),
  ...createPiecesSlice(...a),
  ...createCommentsSlice(...a),
}));

export { useBoundStore as useStore };
