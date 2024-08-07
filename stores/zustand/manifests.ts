import { IFetchManifestByIdData } from "@constants/types/manifests";
import { StateCreator } from "zustand";

export interface ManifestIdsSlice {
  manifestIds: string[];
  addManifestIds: (manifestIds: string[]) => void;
  resetManifestIds: () => void;
}

export interface ManifestsSlice {
  manifests: IFetchManifestByIdData[];
  addManifest: (manifestIds: IFetchManifestByIdData) => void;
  resetManifests: () => void;
}
export const createManifestIdsSlice: StateCreator<ManifestIdsSlice, [], []> = (
  set,
) => ({
  manifestIds: [],
  addManifestIds: (manifestIds: string[]) =>
    set((state) => ({ ...state, manifestIds })),
  resetManifestIds: () => set((state) => ({ ...state, manifestIds: [] })),
});

export const createManifestsSlice: StateCreator<ManifestsSlice, [], []> = (
  set,
) => ({
  manifests: [],
  addManifest: (manifest: IFetchManifestByIdData) =>
    set(({ manifests }) => {
      const newManifests = manifests;
      newManifests.push(manifest);

      return { manifests: newManifests };
    }),
  resetManifests: () => set((state) => ({ ...state, manifests: [] })),
});
