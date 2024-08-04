import { IFetchPiecesByIdData, IFetchShipmentByIdData } from "@constants/types";
import { StateCreator } from "zustand";

export interface ShipmentIdsSlice {
  shipmentIds: number[];
  addShipmentIds: (shipmentIds: number[]) => void;
  resetShipmentIds: () => void;
}

export interface ShipmentSlice {
  shipment: IFetchShipmentByIdData;
  addShipment: (shipment: IFetchShipmentByIdData) => void;
  resetShipment: () => void;
}

export interface PiecesIdsSlice {
  piecesIds: number[];
  addPiecesIds: (piecesIds: number[]) => void;
  resetPiecesIds: () => void;
}

export interface PiecesSlice {
  pieces: IFetchPiecesByIdData[];
  addPieces: (pieces: IFetchPiecesByIdData[]) => void;
  resetPieces: () => void;
}

export interface CommentsSlice {
  comments: string[];
  addComments: (comments: string[]) => void;
  resetCommnets: () => void;
}

export const createShipmentIdsSlice: StateCreator<ShipmentIdsSlice, [], []> = (
  set,
) => ({
  shipmentIds: [],
  addShipmentIds: (shipmentIds: number[]) =>
    set((state) => ({ ...state, shipmentIds: shipmentIds ?? [] })),
  resetShipmentIds: () => set((state) => ({ ...state, shipmentIds: [] })),
});

export const createShipmentSlice: StateCreator<ShipmentSlice, [], []> = (
  set,
) => ({
  shipment: {},
  addShipment: (shipment: IFetchShipmentByIdData) =>
    set((state) => ({ ...state, shipment })),
  resetShipment: () => set((state) => ({ ...state, shipment: {} })),
});

export const createPiecesIdsSlice: StateCreator<PiecesIdsSlice, [], []> = (
  set,
) => ({
  piecesIds: [],
  addPiecesIds: (piecesIds: number[]) =>
    set((state) => ({ ...state, piecesIds })),
  resetPiecesIds: () => set((state) => ({ ...state, piecesIds: [] })),
});

export const createPiecesSlice: StateCreator<PiecesSlice, [], []> = (set) => ({
  pieces: [],
  addPieces: (pieces: IFetchPiecesByIdData[]) =>
    set((state) => ({ ...state, pieces })),
  resetPieces: () => set((state) => ({ ...state, pieces: [] })),
});

export const createCommentsSlice: StateCreator<CommentsSlice, [], []> = (
  set,
) => ({
  comments: [],
  addComments: (comments: string[]) => set((state) => ({ ...state, comments })),
  resetCommnets: () => set((state) => ({ ...state, comments: [] })),
});
