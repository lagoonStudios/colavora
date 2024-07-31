export * as AuthContext from "./AuthContext";

import {
  IFetchManifestByIdData,
  IFetchShipmentByIdData,
} from "@constants/types";
import { create, StateCreator } from "zustand";

interface ManifestIdsSlice {
  manifestIds: number[];
  addManifestIds: (manifestIds: number[]) => void;
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

const createManifestIdsSlice: StateCreator<ManifestIdsSlice, [], []> = (
  set,
) => ({
  manifestIds: [],
  addManifestIds: (manifestIds: number[]) =>
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
    set((state) => ({ ...state, shipmentIds })),
  resetShipmentIds: () => set((state) => ({ ...state, shipmentIds: [] })),
});

const createShipmentSlice: StateCreator<ShipmentSlice, [], []> = (set) => ({
  shipment: {},
  addShipment: (shipment: IFetchShipmentByIdData) =>
    set((state) => ({ ...state, shipment })),
  resetShipment: () => set((state) => ({ ...state, shipment: {} })),
});

const useBoundStore = create<
  ManifestIdsSlice & ManifestsSlice & ShipmentIdsSlice & ShipmentSlice
>()((...a) => ({
  ...createManifestIdsSlice(...a),
  ...createManifestsSlice(...a),
  ...createShipmentIdsSlice(...a),
  ...createShipmentSlice(...a),
}));

export { useBoundStore as useStore };
