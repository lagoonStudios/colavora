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
      errorCompany.message;
      console.error(
        "🚀 ~ useCompanyDataById ~ useEffect ~ data.error.message:",
        errorCompany.message
      );
    }
    if (responseCompanyData) {
      resetCompany();
      addCompany(responseCompanyData);
    }
  }, [
    addCompany,
    responseCompanyData,
    errorCompany,
    isPendingCompany,
    companyId,
  ]);

  // --- END: Side effects -----------------------------------------------------
}

export function useDriverData() {
  // --- Hooks -----------------------------------------------------------------
  const [driverId, setDriverId] = useState(mockDriverId);
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
      errorDriver.message;
      console.error(
        "🚀 ~ useCompanyDataById ~ useEffect ~ data.error.message:",
        errorDriver.message
      );
    }
    if (responseDriverData) {
      addDriver(responseDriverData);
      addCompanyId(responseDriverData.companyID);
    }
  }, [responseDriverData, errorDriver, isPendingDriver, driverId]);
  // --- END: Side effects -----------------------------------------------------
}
