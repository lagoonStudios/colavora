import { IFetchUserData } from "@constants/types/general";
import { IFetchManifestByIdData } from "@constants/types/manifests";
import { IFetchPiecesByIdData, IFetchShipmentByIdData, IOptionalCommentsProps } from "@constants/types/shipments";
import { fetchCommentsByIdData, fetchManifestData, fetchPiecesByIdData, fetchPiecesData, fetchShipmentByIdData, fetchShipmentData } from "@services/custom-api";

export async function fetchData(user: IFetchUserData) {
  return new Promise(async (resolve, reject) => {
    const createdDate = new Date("2024-08-20T00:01:00").toISOString();
    const manifests = new Map<number, IFetchManifestByIdData>();
    const shipments = new Map<number, IFetchShipmentByIdData>();
    const pieces = new Map<number, IFetchPiecesByIdData>();
    const comments = new Map<string, IOptionalCommentsProps>();

    try {
      const manifestIdsFn = await fetchManifestData({ createdDate, companyID: user?.companyID, driverId: String(user?.driverID) })

      if (manifestIdsFn?.data) {
        for (const manifest of manifestIdsFn?.data) {
          const shipmentsByManifest = await fetchShipmentData({ manifest: String(manifest) })

          if (user?.driverID && user?.companyID)
            manifests.set(manifest, {
              manifest: String(manifest),
              companyID: user.companyID,
              driverID: user.driverID,
              createdDate
            })

          if (shipmentsByManifest?.data) {
            for (const shipmentId of shipmentsByManifest.data) {
              const detailShipment = await fetchShipmentByIdData({ id: String(shipmentId) })
              const piecesShipment = await fetchPiecesData({ id: String(shipmentId) })
              const commentsShipment = await fetchCommentsByIdData({ id: String(shipmentId) })

              if (piecesShipment?.data) {
                for (const pieceId of piecesShipment.data) {
                  const piece = await fetchPiecesByIdData({ id: String(pieceId) })

                  if (piece?.data?.pieceID) pieces.set(piece.data.pieceID, piece.data)
                }
              }

              if (commentsShipment?.data) {
                for (const comment of commentsShipment.data) {
                  comments.set(comment, { 
                    comment, 
                    createdDate, 
                    companyID: user.companyID, 
                    shipmentID: detailShipment.data.shipmentID 
                  })
                }
              }

              if (detailShipment?.data?.shipmentID)
                shipments.set(detailShipment.data.shipmentID, detailShipment?.data)
            }
          } else reject("🚀 ~ file: functions.ts:28 ~ fetchData ~ error: Undefined data shipment Ids")
        }
      } else reject("🚀 ~ file: functions.ts:16 ~ fetchData ~ error: Undefined data manifest Ids")
    } catch (error) {
      console.error("🚀 ~ file: functions.ts:12 ~ fetchData ~ error:", error);
      reject("🚀 ~ file: functions.ts:12 ~ fetchData ~ error: " + error);
    }

    resolve({ 
      manifests: [...manifests.values()], 
      shipments: [...shipments.values()], 
      pieces: [...pieces.values()], 
      comments: [...comments.values()] 
    })
  })
}