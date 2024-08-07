import { ICODData, IReasonsByIdData } from "@constants/types/general";
import { StateCreator } from "zustand";

export interface ReasonIdsSlice {
  reasonIds: number[];
  addReasonIds: (reasonIds: number[]) => void;
  resetReasonIds: () => void;
}
export interface ReasonsSlice {
  reasons: IReasonsByIdData[];
  addReason: (reason: IReasonsByIdData) => void;
  setReasons: (reasons: IReasonsByIdData[]) => void;
  resetReasons: () => void;
}
export interface CODIdsSlice {
  CODIds: number[];
  addCODIds: (CODIds: number[]) => void;
  resetCODIds: () => void;
}
export interface CODSlice {
  CODs: ICODData[];
  addCOD: (COD: ICODData) => void;
  resetCODs: () => void;
}

export const createReasonIdsSlice: StateCreator<ReasonIdsSlice, [], []> = (
  set,
) => ({
  reasonIds: [],
  addReasonIds: (reasonIds) => set((state) => ({ ...state, reasonIds })),
  resetReasonIds: () => set((state) => ({ ...state, reasonIds: [] })),
});

export const createReasonsSlice: StateCreator<ReasonsSlice, [], []> = (
  set,
) => ({
  reasons: [],
  addReason: (reason) =>
    set(({ reasons }) => {
      const newReasons = reasons;
      newReasons.push(reason);

      return { reasons: newReasons };
    }),
  setReasons: (reasons) => set((state) => ({ ...state, reasons })),
  resetReasons: () => set((state) => ({ ...state, reasons: [] })),
});

export const createCODIdsSlice: StateCreator<CODIdsSlice, [], []> = (set) => ({
  CODIds: [],
  addCODIds: (CODIds) => set((state) => ({ ...state, CODIds })),
  resetCODIds: () => set((state) => ({ ...state, CODIds: [] })),
});

export const createCODSlice: StateCreator<CODSlice, [], []> = (set) => ({
  CODs: [],
  addCOD: (COD) =>
    set(({ CODs }) => {
      const newCODs = CODs;
      newCODs.push(COD);

      return { CODs: newCODs };
    }),
  resetCODs: () => set((state) => ({ ...state, CODs: [] })),
});
