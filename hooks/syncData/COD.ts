import { mockCompanyId } from "@constants/Constants";
import { useCODIdData, useCODByIdData } from "@hooks/queries";
import i18next from "i18next";
import { useEffect } from "react";
import { useStore } from "@stores/zustand";
import { insertMultipleCOD } from "@hooks/SQLite";

export function useCODFetch() {
  // --- Hooks -----------------------------------------------------------------
  const { addCODIds, CODIds, addCOD, CODs } = useStore();

  const { data: CODIdsData } = useCODIdData(String(mockCompanyId));
  const { data: DataCODs, pending } = useCODByIdData(CODIds, i18next.language);
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (CODIdsData) addCODIds(CODIdsData);
  }, [CODIdsData]);

  useEffect(() => {
    if (pending === false)
      DataCODs?.map((COD) => {
        if (COD) addCOD(COD);
      });
  }, [DataCODs, pending]);

  useEffect(() => {
    if (CODs)
      if (CODs?.length !== 0)
        insertMultipleCOD(CODs)
  }, [CODs])
  // --- END: Side effects -----------------------------------------------------
}