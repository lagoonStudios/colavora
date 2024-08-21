import { StateCreator } from "zustand";

import { IFetchDriverData } from "@constants/types/general";

export interface DriverSlice {
  driver: IFetchDriverData | null;
  addDriver: (driver: IFetchDriverData) => void;
  resetDriver: () => void;
}

export const createDriverSlice: StateCreator<DriverSlice, [], []> = (set) => ({
  driver: null,
  addDriver: (newDriver: IFetchDriverData) =>
    set(({ driver }) => {
      driver = newDriver;
      return { driver };
    }),
  resetDriver: () => set((state) => ({ ...state, driver: null })),
});
