import { useCompanyData } from "@hooks/queries";
import { useState, useEffect } from "react";
import { useStore } from "@stores/zustand";

export function useCompanyFetch() {
  // --- Local state -----------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { user, addCompany, company } = useStore();
  const { data: companyData, isSuccess } = useCompanyData(user?.companyID);
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (companyData && user?.logo) {
      const company = {
        ...companyData,
        logo: user.logo,
      };
      addCompany(company);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyData, user]);

  useEffect(() => {
    if (isSuccess && company) setLoading(false);
  }, [company, isSuccess]);

  useEffect(() => {
    if (loading === false) setSuccess(true);
  }, [loading]);
  // --- END: Side effects -----------------------------------------------------

  return { success, loading };
}
