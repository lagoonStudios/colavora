import { fetchData, fetchDataOptions } from "@utils/functions";
import { createCODTable } from "./cod.local.queries";
import {
  createCommentsTable,
  dropCommentsTable,
  insertMultipleComments,
} from "./comments.local.queries";
import { createExceptionsTable } from "./exceptions.local.queries";
import {
  createManifestsTable,
  dropManifestTable,
  getAllManifestsCount,
  insertMultipleManifests,
} from "./manifests.local.queries";
import {
  createPiecesTable,
  dropPiecesTable,
  insertMultiplePieces,
} from "./pieces.local.queries";
import {
  createShipmentTable,
  dropShipmentTable,
  getTodaysShipments,
  insertMultipleShipments,
} from "./shipments.local.queries";
import { IFetchUserData } from "@constants/types/general";
import { IFetchManifestByIdData } from "@constants/types/manifests";
import {
  IFetchPiecesByIdData,
  IRequiredCommentsProps,
  IShipmentDataFromAPI,
} from "@constants/types/shipments";
import { createEventsQueueTable } from "@hooks/eventsQueue";

export function createAllDBTables() {
  return new Promise((resolve, reject) => {
    Promise.all([
      createManifestsTable(),
      createShipmentTable(),
      createCommentsTable(),
      createPiecesTable(),
      createExceptionsTable(),
      createCODTable(),
      createEventsQueueTable(),
    ])
      .then(() => {
        resolve("Tables created correctly");
      })
      .catch((error) => {
        console.error(
          "🚀 ~ file: general.local.queries.ts:24 ~ createAllDBTables ~ error:",
          error,
        );
        reject(error);
      });
  });
}

export function dropTables() {
  return new Promise((resolve: (value: string) => void, reject) => {
    Promise.all([
      dropManifestTable(),
      dropShipmentTable(),
      dropPiecesTable(),
      dropCommentsTable(),
    ])
      .then(() => {
        resolve("Tables dropped correctly");
      })
      .catch((error) => {
        console.error(
          "🚀 ~ file: general.local.queries.ts:44 ~ dropTables ~ error:",
          error,
        );
        reject(error);
      });
  });
}

export function resetDatabase(user: IFetchUserData, options: fetchDataOptions) {
  return new Promise(
    // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
    async (
      resolve: (value: {
        manifests: IFetchManifestByIdData[];
        shipments: IShipmentDataFromAPI[];
        pieces: IFetchPiecesByIdData[];
        comments: IRequiredCommentsProps[];
      }) => void,
      reject,
      // eslint-disable-next-line @typescript-eslint/require-await
    ) => {
      fetchData(user, options)
        .then((data) => {
          dropTables()
            .then(() => {
              createAllDBTables()
                .then(() => {
                  const { manifests, shipments, pieces, comments } = data;
                  if (options?.setModalMessage)
                    options?.setModalMessage(
                      options?.t?.("MODAL.SAVING_MANIFESTS") ||
                        "Saving manifests",
                    );
                  insertMultipleManifests(manifests)
                    .then(() => {
                      if (options?.setModalMessage)
                        options?.setModalMessage(
                          options?.t?.("MODAL.SAVING_SHIPMENTS") ||
                            "Saving shipments",
                        );
                      insertMultipleShipments(shipments)
                        .then(() => {
                          if (options?.setModalMessage)
                            options?.setModalMessage(
                              options?.t?.("MODAL.SAVING_PIECES") ||
                                "Saving pieces",
                            );
                          Promise.all([
                            insertMultiplePieces(pieces),
                            insertMultipleComments(comments),
                          ])
                            .then(() => {
                              resolve(data);
                            })
                            .catch((error) => {
                              console.error(
                                "🚀 ~ file: general.local.queries.ts:54 ~ requiring pieces and comments ~ error:",
                                error,
                              );
                              reject(error);
                            });
                        })
                        .catch((error) => {
                          console.error(
                            "🚀 ~ file: general.local.queries.ts:55 ~ insertMultipleShipments ~ error:",
                            error,
                          );
                          reject(error);
                        });
                    })
                    .catch((error) => {
                      console.error(
                        "🚀 ~ file: general.local.queries.ts:49 ~ insertMultipleManifests ~ error:",
                        error,
                      );
                      reject(error);
                    });
                })
                .catch((error) => {
                  console.error(
                    "🚀 ~ file: general.local.queries.ts:44 ~ resetDatabase ~ createAllDBTables ~ error:",
                    error,
                  );
                  reject(error);
                });
            })
            .catch((error) => {
              console.error(
                "🚀 ~ file: general.local.queries.ts:16 ~ resetDatabase ~ error:",
                error,
              );
              reject(error);
            });
        })
        .catch((error) => {
          console.error(
            "🚀 ~ file: general.local.queries.ts:37 ~ fetchData ~ error:",
            error,
          );
          reject(error);
        });
    },
  );
}

export function getHomeCounters() {
  return new Promise(
    (
      resolve: (value: { todayShipments: number; manifests: number }) => void,
      reject,
    ) => {
      Promise.all([getTodaysShipments(), getAllManifestsCount()])
        .then((res) => {
          const todayShipments = res[0]?.count ?? 0;
          const manifests = res[1]?.count ?? 0;
          resolve({ todayShipments, manifests });
        })
        .catch((error) => {
          error(
            "🚀 ~ file: general.local.queries.ts:16 ~ getHomeCounters ~ error:",
            error,
          );
          reject(error);
        });
    },
  );
}
