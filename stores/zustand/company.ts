import { IFetchCompanyData } from "@constants/types/general";
import { StateCreator } from "zustand";

export interface CompanySlice {
  company: IFetchCompanyData | null;
  addCompany: (company: IFetchCompanyData) => void;
  resetCompany: () => void;
}

export const createCompanySlice: StateCreator<CompanySlice, [], []> = (
  set,
) => ({
  company: null,
  addCompany: (newCompany: IFetchCompanyData) =>
    set((state) => ({ ...state, company: newCompany })),
  resetCompany: () => set((state) => ({ ...state, company: null })),
});
