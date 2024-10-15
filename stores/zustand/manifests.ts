import { IFetchManifestByIdData } from "@constants/types/manifests";
import { StateCreator } from "zustand";

export interface ManifestIdsSlice {
  manifestIds: number[];
  addManifestIds: (manifestIds: number[]) => void;
  resetManifestIds: () => void;
}

export interface ManifestsSlice {
  manifests: IFetchManifestByIdData[];
  manifest: string;
  addManifest: (manifestIds: IFetchManifestByIdData) => void;
  addManifestId: (manifest: string) => void;
  resetManifests: () => void;
  resetManifestId: () => void;
}
export const createManifestIdsSlice: StateCreator<ManifestIdsSlice, [], []> = (
  set,
) => ({
  manifestIds: [],
  manifest: "",
  addManifestIds: (manifestIds: number[]) =>
    set((state) => ({ ...state, manifestIds })),
  resetManifestIds: () => set((state) => ({ ...state, manifestIds: [] })),
});

export const createManifestsSlice: StateCreator<ManifestsSlice, [], []> = (
  set,
) => ({
  manifests: [],
  manifest: "",
  addManifest: (manifest: IFetchManifestByIdData) =>
    set((state) => {
      const newManifests = state.manifests;
      newManifests.push(manifest);

      return { ...state, manifests: newManifests };
    }),
  addManifestId: (manifest: string) => set((state) => ({ ...state, manifest })),
  resetManifests: () => set((state) => ({ ...state, manifests: [] })),
  resetManifestId: () => set((state) => ({ ...state, manifest: "" })),
});
