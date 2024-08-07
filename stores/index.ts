export * as AuthContext from "./AuthContext";

import {
  IFetchManifestByIdData,
  IFetchPiecesByIdData,
  IFetchShipmentByIdData,
} from "@constants/types";
import { create, StateCreator } from "zustand";

interface ManifestIdsSlice {
  manifestIds: string[];
  addManifestIds: (manifestIds: string[]) => void;
  resetManifestIds: () => void;
}

interface ManifestsSlice {
  manifests: IFetchManifestByIdData[];
  addManifest: (manifestIds: IFetchManifestByIdData) => void;
  resetManifests: () => void;
}
interface ShipmentIdsSlice {
  shipmentIds: number[];
  addShipmentIds: (shipmentIds: number[]) => void;
  resetShipmentIds: () => void;
}

interface ShipmentSlice {
  shipment: IFetchShipmentByIdData;
  addShipment: (shipment: IFetchShipmentByIdData) => void;
  resetShipment: () => void;
}

interface PiecesIdsSlice {
  piecesIds: number[];
  addPiecesIds: (piecesIds: number[]) => void;
  resetPiecesIds: () => void;
}

interface PiecesSlice {
  pieces: IFetchPiecesByIdData[];
  addPieces: (pieces: IFetchPiecesByIdData[]) => void;
  resetPieces: () => void;
}

const createManifestIdsSlice: StateCreator<ManifestIdsSlice, [], []> = (
  set,
) => ({
  manifestIds: [],
  addManifestIds: (manifestIds: string[]) =>
    set((state) => ({ ...state, manifestIds })),
  resetManifestIds: () => set((state) => ({ ...state, manifestIds: [] })),
});

const createManifestsSlice: StateCreator<ManifestsSlice, [], []> = (set) => ({
  manifests: [],
  addManifest: (manifest: IFetchManifestByIdData) =>
    set(({ manifests }) => {
      const newManifests = manifests;
      newManifests.push(manifest);

      return { manifests: newManifests };
    }),
  resetManifests: () => set((state) => ({ ...state, manifests: [] })),
});

const createShipmentIdsSlice: StateCreator<ShipmentIdsSlice, [], []> = (
  set,
) => ({
  shipmentIds: [],
  addShipmentIds: (shipmentIds: number[]) =>
    set((state) => ({ ...state, shipmentIds: shipmentIds ?? [] })),
  resetShipmentIds: () => set((state) => ({ ...state, shipmentIds: [] })),
});

const createShipmentSlice: StateCreator<ShipmentSlice, [], []> = (set) => ({
  shipment: {},
  addShipment: (shipment: IFetchShipmentByIdData) =>
    set((state) => ({ ...state, shipment })),
  resetShipment: () => set((state) => ({ ...state, shipment: {} })),
});

const createPiecesIdsSlice: StateCreator<PiecesIdsSlice, [], []> = (set) => ({
  piecesIds: [],
  addPiecesIds: (piecesIds: number[]) =>
    set((state) => ({ ...state, piecesIds })),
  resetPiecesIds: () => set((state) => ({ ...state, piecesIds: [] })),
});

const createPiecesSlice: StateCreator<PiecesSlice, [], []> = (set) => ({
  pieces: [],
  addPieces: (pieces: IFetchPiecesByIdData[]) =>
    set((state) => ({ ...state, pieces })),
  resetPieces: () => set((state) => ({ ...state, pieces: [] })),
});

const useBoundStore = create<
  ManifestIdsSlice &
    ManifestsSlice &
    ShipmentIdsSlice &
    ShipmentSlice &
    PiecesIdsSlice &
    PiecesSlice
>()((...a) => ({
  ...createManifestIdsSlice(...a),
  ...createManifestsSlice(...a),
  ...createShipmentIdsSlice(...a),
  ...createShipmentSlice(...a),
  ...createPiecesIdsSlice(...a),
  ...createPiecesSlice(...a),
}));

export { useBoundStore as useStore };
