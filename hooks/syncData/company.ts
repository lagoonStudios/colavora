import { mockDriverId } from "@constants/Constants";
import { useCompanyData } from "@hooks/queries";
import { useState, useEffect } from "react";
import { useStore } from "@stores/zustand";

export function useCompanyFetch() {
  // --- Local state -----------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { driver, addCompany, company } = useStore();
  const { data: companyData, isSuccess } = useCompanyData(driver?.companyID);  
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (companyData && driver) {
      const company = {
        ...companyData,
        logo: driver?.logo ?? companyData.logo
      }
      addCompany(company)
    }
  }, [companyData, driver]);
  
  useEffect(() => {
    if (isSuccess && company) setLoading(false);
  }, [isSuccess]);

  useEffect(() => {
    if(loading === false) setSuccess(true)
  }, [loading])
  // --- END: Side effects -----------------------------------------------------

  return { success, loading };
}