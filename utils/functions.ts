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
  optionalDate?: string
}

export async function fetchData(user: IFetchUserData, options?: fetchDataOptions) {
  return new Promise(async (resolve: (value: {
    manifests: IFetchManifestByIdData[],
    shipments: IFetchShipmentByIdData[],
    pieces: IFetchPiecesByIdData[],
    comments: IRequiredCommentsProps[]
  }) => void, reject) => {
    const createdDate = options?.optionalDate ?? new Date("2024-08-20T00:01:00").toISOString();
    console.log("Fetching data");
    try {
      fetchManifests(createdDate, user, options).then(manifests => {
        const manifestIds = manifests.map(v => v.manifest!).filter(id => id != null);

        fetchShipmentsIDs(manifestIds, options).then(shipmentsIDs => {

          Promise.all([
            fetchShipmentsData(shipmentsIDs, options),
            fetchPiecesDataFn(shipmentsIDs, options),
            fetchCommentsData(shipmentsIDs, user, createdDate, options)
          ]).then(([shipments, pieces, comments]) => {
            resolve({
              manifests,
              shipments,
              pieces,
              comments
            })
          }).catch(error => {
            console.error("🚀 ~ file: functions.ts:100 ~ Promise.all ~ error:", error);
            reject("🚀 ~ file: functions.ts:100 ~ fetchData ~ error: " + error)
          })
        }).catch(error => {
          console.error("🚀 ~ file: functions.ts:45 ~ fetchShipmentsIDs ~ error:", error);
          reject(error)
        })
      }).catch(error => {
        console.error("🚀 ~ file: functions.ts:49 ~ fetchManifests ~ error:", error);
        reject(error)
      });
    } catch (error) {
      console.error("🚀 ~ file: functions.ts:12 ~ fetchData ~ error:", error);
      reject("🚀 ~ file: functions.ts:12 ~ fetchData ~ error: " + error);
    }
  })
}

function fetchManifests(createdDate: string, user: IFetchUserData, options?: fetchDataOptions) {
  return new Promise(async (resolve: (value: IFetchManifestByIdData[]) => void, reject) => {
    const manifests = new Map<number, IFetchManifestByIdData>();
    if (options?.setModalMessage) options?.setModalMessage(options?.t?.("MODAL.FETCHING_MANIFESTS") || "Fetching manifests")
    try {
      const manifestIdsFn = await fetchManifestData({ createdDate, companyID: user?.companyID, driverId: String(user?.driverID) })
      if (manifestIdsFn?.data != null) {
        for (const manifestId of manifestIdsFn?.data) {
          if (user?.driverID && user?.companyID)
            manifests.set(manifestId, {
              manifest: String(manifestId),
              companyID: user.companyID,
              driverID: user.driverID,
              createdDate
            })
        }
        resolve([...manifests.values()]);
      } else {
        console.error("🚀 ~ file: functions.ts:130 ~ fetchManifests ~ error: Undefined data manifest Ids")
        reject("🚀 ~ file: functions.ts:130 ~ fetchManifests ~ error: Undefined data manifest Ids")
      }
    } catch (error) {
      console.error("🚀 ~ file: functions.ts:122 ~ fetchManifests ~ error:", error);
      reject(error)
    }
  });
}

function fetchShipmentsIDs(manifestIds: string[], options?: fetchDataOptions) {
  return new Promise(async (resolve: (value: number[]) => void, reject) => {
    if (options?.setModalMessage) options?.setModalMessage(options?.t?.("MODAL.FETCHING_SHIPMENTS") || "Fetching shipments")

    const shipmentIds = new Set<number>()
    const shipmentsIdsPromises: Promise<AxiosResponse<number[], any>>[] = [];

    for (const manifestId of manifestIds) {
      const shipmentIdPromise = fetchShipmentData({ manifest: String(manifestId) })
      shipmentsIdsPromises.push(shipmentIdPromise)
    }

    Promise.all(shipmentsIdsPromises).then(shipmentsIdsResponse => {
      shipmentsIdsResponse.forEach(v => v.data.forEach(id => shipmentIds.add(id)))

      resolve([...shipmentIds])
    }).catch(error => {
      console.error("🚀 ~ file: functions.ts:178 ~ fetchShipmentsIDs ~ error:", error);
      reject(error)
    })
  });
}


function fetchShipmentsData(shipmentIds: number[], options?: fetchDataOptions) {
  return new Promise(async (resolve: (value: IFetchShipmentByIdData[]) => void, reject) => {
    if (options?.setModalMessage) options?.setModalMessage(options?.t?.("MODAL.FETCHING_SHIPMENTS") || "Fetching shipments")
    const promises: Promise<AxiosResponse<IFetchShipmentByIdData, any>>[] = [];
    const shipments = new Map<number, IFetchShipmentByIdData>();


    for (const id of shipmentIds) {
      const shipmentPromise = fetchShipmentByIdData({ id: String(id) })
      promises.push(shipmentPromise)
    }

    Promise.all(promises).then(shipmentsResponse => {
      for (const shipment of shipmentsResponse) {
        if (shipment?.data?.shipmentID != null) shipments.set(shipment.data.shipmentID, shipment.data)
      }
      resolve([...shipments.values()])
    }).catch(error => {
      console.error("🚀 ~ file: functions.ts:208 ~ fetchShipmentsData ~ error:", error);
      reject(error)
    })
  });

}

function fetchPiecesDataFn(shipmentIds: number[], options?: fetchDataOptions) {
  return new Promise(async (resolve: (value: IFetchPiecesByIdData[]) => void, reject) => {

    if (options?.setModalMessage) options?.setModalMessage(options?.t?.("MODAL.FETCHING_PIECES") || "Fetching shipments pieces")

    const promisesPiecesIDs: Promise<AxiosResponse<number[], any>>[] = [];
    const pieces = new Map<number, IFetchPiecesByIdData>();

    for (const id of shipmentIds) {
      const piecesIDPromise = fetchPiecesData({ id: String(id) })
      promisesPiecesIDs.push(piecesIDPromise)
    }

    Promise.all(promisesPiecesIDs).then(piecesResponse => {
      const piecesPromises: Promise<AxiosResponse<IFetchPiecesByIdData, any>>[] = [];

      piecesResponse.forEach(pieceRes => {
        pieceRes.data?.forEach(pieceId => {
          const piecePromise = fetchPiecesByIdData({ id: String(pieceId) })
          piecesPromises.push(piecePromise)
        });
      })

      Promise.all(piecesPromises).then(response => {
        response.forEach(res => {
          if (res.data?.pieceID != null) pieces.set(res.data.pieceID, res.data)
        });
        resolve([...pieces.values()])
      });

    }).catch(error => {
      console.error("🚀 ~ file: functions.ts:228 ~ fetchPiecesData ~ error:", error);
      reject(error)
    })
  });
}


function fetchCommentsData(shipmentIds: number[], user: IFetchUserData, createdDate: string, options?: fetchDataOptions) {
  return new Promise(async (resolve: (value: IRequiredCommentsProps[]) => void, reject) => {
    const comments = new Map<string, IRequiredCommentsProps>();
    if (options?.setModalMessage) options?.setModalMessage(options?.t?.("MODAL.SAVING_COMMENTS") || "Fetching shipments pieces")

    for (const shipmentId of shipmentIds) {
      try {
        const commentsByShipment = (await fetchCommentsByIdData({ id: String(shipmentId) })).data
        if (commentsByShipment != null) {
          for (const comment of commentsByShipment) {
            comments.set(shipmentId + '-' + comment, {
              comment,
              createdDate,
              companyID: user.companyID,
              shipmentID: shipmentId!
            })
          }
        }
      } catch (error) {
        console.error("🚀 ~ file: functions.ts:253 ~ returnnewPromise ~ error:", error);
        reject(error)
      }
    }
    resolve([...comments.values()])
  })
}