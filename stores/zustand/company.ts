import { IFetchCompanyData } from "@constants/types/general";
import { StateCreator } from "zustand";

export interface CompanySlice {
  company: IFetchCompanyData | null;
  addCompany: (company: IFetchCompanyData) => void;
  resetCompany: () => void;
}

export interface CompanyIdsSlice {
  companyId: string | null;
  addCompanyId: (companyId: string) => void;
  resetCompanyId: () => void;
}

export const createCompanySlice: StateCreator<CompanySlice, [], []> = (
  set,
) => ({
  company: null,
  addCompany: (newCompany: IFetchCompanyData) =>
    set((state) => ({ ...state, company: newCompany })),
  resetCompany: () => set((state) => ({ ...state, company: null })),
});

export const createCompanyIdsSlice: StateCreator<CompanyIdsSlice, [], []> = (
  set,
) => ({
  companyId: null,
  addCompanyId: (newCompanyId: string) =>
    set((state) => ({ ...state, companyId: newCompanyId })),
  resetCompanyId: () => set((state) => ({ ...state, companyId: null })),
});
