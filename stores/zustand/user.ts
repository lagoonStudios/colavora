import { StateCreator } from "zustand";

import { IFetchUserData } from "@constants/types/general";

export interface UserSlice {
  user: IFetchUserData | null;
  addUser: (user: IFetchUserData) => void;
  resetUser: () => void;
}

export const createUserSlice: StateCreator<UserSlice, [], []> = (set) => ({
  user: null,
  addUser: (newUser: IFetchUserData) =>
    set((state) => ({ ...state, user: newUser })),
  resetUser: () => set((state) => ({ ...state, user: null })),
});
