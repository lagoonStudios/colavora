import {
  useCompanyData as useCompanyDataHook,
  useDriverData as useDriverDataHook,
} from "@hooks/index";
import { useStore } from "@stores/zustand";
import { useEffect, useState } from "react";
import { mockDriverId } from "@constants/Constants";

export function useCompanyData() {
  // --- Hooks -----------------------------------------------------------------
  const { addCompany, resetCompany, companyId } = useStore();

  const {
    data: responseCompanyData,
    isError: isErrorCompany,
    error: errorCompany,
    isPending: isPendingCompany,
  } = useCompanyDataHook(companyId!);

  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (companyId == undefined || isPendingCompany) return;
    if (isErrorCompany) {
      console.error(
        "🚀 ~ useCompanyDataById ~ useEffect ~ data.error.message:",
        errorCompany.message,
      );
    }
    if (responseCompanyData) {
      resetCompany();
      addCompany(responseCompanyData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseCompanyData, errorCompany, isPendingCompany, companyId]);

  // --- END: Side effects -----------------------------------------------------
}

export function useDriverData() {
  // --- Hooks -----------------------------------------------------------------
  const [driverId] = useState(mockDriverId);
  const { addCompanyId, addDriver } = useStore();

  const {
    data: responseDriverData,
    error: errorDriver,
    isError: isErrorDriver,
    isPending: isPendingDriver,
  } = useDriverDataHook(driverId);

  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (driverId == undefined || isPendingDriver) return;
    if (isErrorDriver) {
      console.error(
        "🚀 ~ useCompanyDataById ~ useEffect ~ data.error.message:",
        errorDriver.message,
      );
    }
    if (responseDriverData) {
      addDriver(responseDriverData);
      addCompanyId(responseDriverData.companyID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseDriverData, errorDriver, isPendingDriver, driverId]);
  // --- END: Side effects -----------------------------------------------------
}
