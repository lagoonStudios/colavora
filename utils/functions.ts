import { AxiosResponse } from "axios";
import { parse, isValid, format } from 'date-fns';

import { IFetchUserData } from "@constants/types/general";
import { IFetchManifestByIdData } from "@constants/types/manifests";
import { IFetchPiecesByIdData, IFetchShipmentByIdData, IRequiredCommentsProps, IShipmentDataFromAPI } from "@constants/types/shipments";
import { fetchCommentsByIdData, fetchManifestOfflineData, fetchPiecesByIdData, fetchPiecesData, fetchShipmentByIdData, fetchShipmentData } from "@services/custom-api";
export function parserStringToDateComment(value: string) {
  const regex = /\(([^)]+)\)(.*)/;
  const match = value.match(regex);

  if (!match) {
    return {
      createdDate: "",
      comment: value
    }; 
  }

  const stringDate = match[1].trim();
  const restoCadena = match[2].trim();

  const date = parse(stringDate, 'MM/dd/yy hh:mm:ss aa', new Date());

  if (!isValid(date)) {
    return {
      createdDate: "",
      comment: value
    }; 
  }

  const ISODate = format(date, 'yyyy-MM-ddTHH:mm:ss');
  return {
    createdDate: ISODate,
    comment: restoCadena
  };
}

export type TCommentForDB = Pick<IRequiredCommentsProps, "comment" | "shipmentID" | "createdDate">

export type fetchDataOptions = {
  /** Used to update the state modal message */
  setModalMessage?: (message: string) => void
  /** Used to translate the text */
  t?: (key: string) => string
}

export function parseOfflineData(rawManifests: IFetchManifestByIdData[]) {
  const manifests: IFetchManifestByIdData[] = [];
  const shipments: IShipmentDataFromAPI[] = [];
  const comments: TCommentForDB[] = [];
  const pieces: IFetchPiecesByIdData[] = [];

  for (const rawManifest of rawManifests) {
    const manifest = rawManifest as IFetchManifestByIdData;

    if (rawManifest?.shipments)
      for (const rawShipment of rawManifest?.shipments) {
        const shipment = {...rawShipment, manifest: manifest.manifest};

        if (shipment?.companyID && shipment?.shipmentID) {
          if (rawShipment?.comments)
            for (const rawComment of rawShipment?.comments)
              comments.push({
                shipmentID: shipment.shipmentID,
                comment: rawComment,
                createdDate: new Date().toISOString()
              })

          if (rawShipment?.pieces)
            for (const rawPiece of rawShipment?.pieces)
              pieces.push({
                ...rawPiece,
                shipmentID: shipment.shipmentID,
                companyID: shipment.companyID,
                pod: rawPiece?.pod ?? "",
                pwBack: rawPiece?.pwBack ?? ""
              })
        }

        shipments.push(shipment)
      }

    manifests.push(manifest)
  }

  return {
    manifests,
    shipments,
    pieces,
    comments
  }
}

export async function fetchData(user: IFetchUserData, options: fetchDataOptions) {
  return new Promise(async (resolve: (value: {
    manifests: IFetchManifestByIdData[],
    shipments: IFetchShipmentByIdData[],
    pieces: IFetchPiecesByIdData[],
    comments: IRequiredCommentsProps[]
  }) => void, reject) => {
    const date = new Date();

    date.setTime(date.getTime() - 14 * 24 * 60 * 60 * 1000);
    date.setHours(1);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    // const createdDate = date.toISOString();
    //TODO FIX DATE ISSUE. NOW USING A FIXED DATE
    const createdDate = new Date("2024-08-20T00:01:00").toISOString();

    try {
      fetchManifests(createdDate, user, options).then(rawManifests => {
        const data = parseOfflineData(rawManifests);

        const comments = data.comments.map((rawComment) => {
          const comment = rawComment as IRequiredCommentsProps;
          return comment
        })

        resolve({
          ...data,
          comments
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
    const manifests = new Map<string, IFetchManifestByIdData>();

    if (options?.setModalMessage) options?.setModalMessage(options?.t?.("MODAL.FETCHING_MANIFESTS") || "Fetching manifests")
    try {
      const manifestIdsFn = await fetchManifestOfflineData({
        createdDate,
        companyID: user.companyID,
        driverId: String(user.driverID)
      })

      if (manifestIdsFn?.data != null) {
        for (const manifest of manifestIdsFn?.data) {
          if (manifest != null)
            if (user?.driverID && user?.companyID)
              manifests.set(manifest.manifestId, {
                ...manifest,
                manifest: manifest.manifestId,
                driverID: user.driverID,
              })

        }
        resolve([...manifests.values()]);
      } else {
        console.error("🚀 ~ file: functions.ts:86 ~ fetchManifests ~ error: Undefined data manifest Ids")
        reject("🚀 ~ file: functions.ts:87 ~ fetchManifests ~ error: Undefined data manifest Ids")
      }
    } catch (error) {
      console.error("🚀 ~ file: functions.ts:90 ~ fetchManifests ~ error:", error);
      reject(error)
    }
  });
}

export function fetchShipmentsIDs(manifestIds: string[], user: IFetchUserData, options?: fetchDataOptions) {
  return new Promise(async (resolve: (value: number[]) => void, reject) => {
    if (options?.setModalMessage) options?.setModalMessage(options?.t?.("MODAL.FETCHING_SHIPMENTS") || "Fetching shipments")

    const shipmentIds = new Set<number>()
    const shipmentsIdsPromises: Promise<AxiosResponse<number[], any>>[] = [];

    for (const manifestId of manifestIds) {
      const shipmentIdPromise = fetchShipmentData({ manifest: String(manifestId), companyID: user.companyID, driverId: String(user.driverID) })
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


export function fetchShipmentsData(shipmentIds: number[], options?: fetchDataOptions) {
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

export function fetchPiecesDataFn(shipmentIds: number[], user: IFetchUserData, options?: fetchDataOptions) {
  return new Promise(async (resolve: (value: IFetchPiecesByIdData[]) => void, reject) => {

    if (options?.setModalMessage) options?.setModalMessage(options?.t?.("MODAL.FETCHING_PIECES") || "Fetching shipments pieces")

    const promisesPiecesIDs: Promise<AxiosResponse<number[], any>>[] = [];
    const pieces = new Map<number, IFetchPiecesByIdData>();

    for (const id of shipmentIds) {
      const piecesIDPromise = fetchPiecesData({ id: String(id), companyID: user.companyID })
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


export function fetchCommentsData(shipmentIds: number[], user: IFetchUserData, createdDate: string, options?: fetchDataOptions) {
  return new Promise(async (resolve: (value: IRequiredCommentsProps[]) => void, reject) => {
    const comments = new Map<string, IRequiredCommentsProps>();
    if (options?.setModalMessage) options?.setModalMessage(options?.t?.("MODAL.FETCHING_COMMENTS") || "Fetching shipments pieces")

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