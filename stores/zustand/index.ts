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
import {
  ReasonIdsSlice,
  ReasonsSlice,
  createReasonIdsSlice,
  createReasonsSlice,
  CODIdsSlice,
  CODSlice,
  createCODIdsSlice,
  createCODSlice,
} from "./general";

const useBoundStore = create<
  ManifestIdsSlice &
    ManifestsSlice &
    ShipmentIdsSlice &
    ShipmentSlice &
    PiecesIdsSlice &
    PiecesSlice &
    CommentsSlice &
    ReasonIdsSlice &
    ReasonsSlice &
    CODIdsSlice &
    CODSlice
>()((...a) => ({
  ...createManifestIdsSlice(...a),
  ...createManifestsSlice(...a),
  ...createShipmentIdsSlice(...a),
  ...createShipmentSlice(...a),
  ...createPiecesIdsSlice(...a),
  ...createPiecesSlice(...a),
  ...createCommentsSlice(...a),
  ...createReasonIdsSlice(...a),
  ...createReasonsSlice(...a),
  ...createCODIdsSlice(...a),
  ...createCODSlice(...a),
}));

export { useBoundStore as useStore };
