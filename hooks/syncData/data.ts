import { differenceInCalendarDays } from 'date-fns';
import { useState, useEffect, useCallback } from "react";

import { useStore } from "@stores/zustand";
import { IFetchUserData } from "@constants/types/general";
import { useTranslation } from "react-i18next";
import { fetchData } from "@utils/functions";
import { getAllManifestIds, getAllShipmentIds, getShipmentList, insertMultipleManifests, insertMultipleShipments } from "@hooks/SQLite";
import { insertMultipleComments } from "@hooks/SQLite/queries/comments.local.queries";
import { insertMultiplePieces } from "@hooks/SQLite/queries/pieces.local.queries";



export function useDataFetch(user: IFetchUserData | null) {
  // --- Local state -----------------------------------------------------------
  const [success, setSuccess] = useState(false);
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const {
    setModal,
    setVisible,
    setSyncing,
    setLastSyncDate,
    addManifestIds,
    addShipmentIds,
    addManifestId,
    lastSyncDate
  } = useStore();
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------------
  const fetchDataLocally = useCallback((user: IFetchUserData) => {
    setSyncing(true);
    fetchData(user, {
      t,
      setModalMessage: setModal,
    }).then((values) => {
      setLastSyncDate(new Date().toISOString());
      const manifestIdsFromFetching = values.manifests.map(({ manifest }) => Number(manifest))

      insertMultipleManifests(values.manifests).then(() => {
        insertMultipleShipments(values.shipments).then(() => {
          insertMultipleComments(values.comments);
          insertMultiplePieces(values.pieces);

          if (manifestIdsFromFetching.length > 0) {
            addManifestIds(values.manifests.map(({ manifest }) => Number(manifest)))
            addManifestId(String(manifestIdsFromFetching[0]));
          }

        });
      });

      setSyncing(false);
      setVisible(false);
    })
      .catch(() => {
        setSyncing(false);
        setVisible(false);
      })
  }, [])
  // --- END: Data and handlers ------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (user && lastSyncDate === null) {
      fetchDataLocally(user)
    } else if (user && lastSyncDate !== null) {
      const actualDate = new Date();
      const lastDate = new Date(lastSyncDate);
      const difference = differenceInCalendarDays(actualDate, lastDate)
      /* TO DO: si la diferencia de fecha es 0 requerir la local data para meterla en zustand */
      if (difference > 0) fetchDataLocally(user)
      else if (difference === 0) {
        getAllManifestIds().then((manifestIds) => {
          if (manifestIds.length > 0)
            addManifestIds(manifestIds)

          const firstManifest = manifestIds.sort((a, b) => a - b)?.[0];

          if (firstManifest) {
            addManifestId(String(firstManifest));
            getAllShipmentIds({ manifestID: String(firstManifest) }).then((shipmentsIdsLocal) => {
              const shipmentIds = shipmentsIdsLocal?.map(({ shipmentID }) => shipmentID)

              if (shipmentIds?.length > 0) addShipmentIds(shipmentIds)
            })
          }

          setSyncing(false);
          setVisible(false);
        })
      }
    }
  }, [user, lastSyncDate])
  // --- END: Side effects -----------------------------------------------------

  return { success };
}