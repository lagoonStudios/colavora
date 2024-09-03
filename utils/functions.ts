import { IFetchUserData } from "@constants/types/general";
import { IFetchManifestByIdData } from "@constants/types/manifests";
import { IFetchPiecesByIdData, IFetchShipmentByIdData, IRequiredCommentsProps } from "@constants/types/shipments";
import { fetchCommentsByIdData, fetchManifestData, fetchPiecesByIdData, fetchPiecesData, fetchShipmentByIdData, fetchShipmentData } from "@services/custom-api";
import { AxiosResponse } from "axios";

export type fetchDataOptions = {
  /** Used to update the state modal message */
  setModalMessage?: (message: string) => void
  /** Used to translate the text */
  t?: (key: string) => string
}

export async function fetchData(user: IFetchUserData, options?: fetchDataOptions) {
  return new Promise(async (resolve: (value: {
    manifests: IFetchManifestByIdData[],
    shipments: IFetchShipmentByIdData[],
    pieces: IFetchPiecesByIdData[],
    comments: IRequiredCommentsProps[]
  }) => void, reject) => {
    const createdDate = new Date("2024-08-20T00:01:00").toISOString();
    const manifests = new Map<number, IFetchManifestByIdData>();
    const shipments = new Map<number, IFetchShipmentByIdData>();
    const pieces = new Map<number, IFetchPiecesByIdData>();
    const comments = new Map<string, IRequiredCommentsProps>();
    console.log("Fetching data");
    try {
      if (options?.setModalMessage) options?.setModalMessage(options?.t?.("MODAL.FETCHING_MANIFESTS") || "Fetching manifests")
      const manifestIdsFn = await fetchManifestData({ createdDate, companyID: user?.companyID, driverId: String(user?.driverID) })

      if (manifestIdsFn?.data.length > 0) {
        for (const manifestId of manifestIdsFn?.data) {
          try {
            if (options?.setModalMessage) options?.setModalMessage(options?.t?.("MODAL.FETCHING_SHIPMENTS") || "Fetching shipments")
            const shipmentsByManifest = await fetchShipmentData({ manifest: String(manifestId) })
            if (user?.driverID && user?.companyID)
              manifests.set(manifestId, {
                manifest: String(manifestId),
                companyID: user.companyID,
                driverID: user.driverID,
                createdDate
              })

            if (shipmentsByManifest?.data.length > 0) {
              for (const shipmentId of shipmentsByManifest.data) {
                await Promise.all([
                  fetchShipmentByIdData({ id: String(shipmentId) }),
                  fetchPiecesData({ id: String(shipmentId) }),
                  fetchCommentsByIdData({ id: String(shipmentId) })
                ]).then(async ([detailShipment, piecesShipment, commentsShipment]) => {
                  if (commentsShipment?.data.length > 0) {
                    for (const comment of commentsShipment.data) {
                      comments.set(shipmentId + '-' + comment, {
                        comment,
                        createdDate,
                        companyID: user.companyID,
                        shipmentID: detailShipment.data.shipmentID!
                      })
                    }
                  }

                  if (detailShipment?.data?.shipmentID)
                    shipments.set(detailShipment.data.shipmentID, detailShipment?.data)

                  if (piecesShipment?.data) {
                    const piecesPromises: Promise<AxiosResponse<IFetchPiecesByIdData, any>>[] = [];
                    for (const pieceId of piecesShipment.data) {
                      const piecePromise = fetchPiecesByIdData({ id: String(pieceId) })
                      piecesPromises.push(piecePromise)
                    }
                    console.log("Buscando piezas");
                    if (options?.setModalMessage) options?.setModalMessage(options?.t?.("MODAL.FETCHING_PIECES") || "Fetching shipments pieces")

                    await Promise.all(piecesPromises).then((piecesResponse) => {
                      for (const piece of piecesResponse) {
                        if (piece?.data?.pieceID) pieces.set(piece.data.pieceID, piece.data)
                      }
                    }).catch(error => {
                      console.error("🚀 ~ file: functions.ts:65 ~ Promise.all ~ error:", error);
                      reject("🚀 ~ file: functions.ts:65 ~ fetchPiecesByIdData ~ error: " + error)
                    })
                  }
                }).catch(error => {
                  console.error("🚀 ~ file: functions.ts:67 ~ fetching shipment data ~ error:", error);
                  reject("🚀 ~ file: functions.ts:67 ~ fetching shipment data ~ error: " + error)
                });
              }
            } else reject("🚀 ~ file: functions.ts:28 ~ fetchData ~ error: Undefined data shipment Ids")
          } catch (error) {
            console.error("🚀 ~ file: functions.ts:70 ~ fetchShipmentData ~ error:", error);
            reject("🚀 ~ file: functions.ts:70 ~ fetchShipmentData ~ error: " + error)
          }
        }

        resolve({
          manifests: [...manifests.values()],
          shipments: [...shipments.values()].sort((a, b) => {
            if (a.shipmentID && b.shipmentID) return a.shipmentID - b.shipmentID
            else return 0
          }),
          pieces: [...pieces.values()],
          comments: [...comments.values()]
        })
      } else reject("🚀 ~ file: functions.ts:16 ~ fetchData ~ error: Undefined data manifest Ids")
    } catch (error) {
      console.error("🚀 ~ file: functions.ts:12 ~ fetchData ~ error:", error);
      reject("🚀 ~ file: functions.ts:12 ~ fetchData ~ error: " + error);
    }
  })
}