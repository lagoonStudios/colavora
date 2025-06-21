import { TCommentInsertData } from "@/db/schema/comments";
import { TPiecesInsertData } from "@/db/schema/pieces";
import { TShipmentsData } from "@/db/schema/shipments";
import { IOptionalCommentsProps } from "@constants/types/shipments";
import { StateCreator } from "zustand";

export interface ShipmentIdsSlice {
  shipmentIds: number[];
  addShipmentIds: (shipmentIds: number[]) => void;
  resetShipmentIds: () => void;
}

export interface ShipmentSlice {
  shipment: TShipmentsData | null;
  addShipment: (shipment: TShipmentsData) => void;
  resetShipment: () => void;
}

export interface PiecesIdsSlice {
  piecesIds: number[];
  addPiecesIds: (piecesIds: number[]) => void;
  resetPiecesIds: () => void;
}

export interface PiecesSlice {
  pieces: TPiecesInsertData[];
  addPieces: (pieces: TPiecesInsertData[]) => void;
  resetPieces: () => void;
}

export interface CommentsSlice {
  comments: Pick<
    TCommentInsertData,
    "shipmentID" | "comment" | "createdDate"
  >[];
  addComments: (
    comments: Pick<
      TCommentInsertData,
      "shipmentID" | "comment" | "createdDate"
    >[]
  ) => void;
  resetCommnets: () => void;
}

export const createShipmentIdsSlice: StateCreator<ShipmentIdsSlice, [], []> = (
  set
) => ({
  shipmentIds: [],
  addShipmentIds: (shipmentIds) =>
    set((state) => ({ ...state, shipmentIds: shipmentIds })),
  resetShipmentIds: () => set((state) => ({ ...state, shipmentIds: [] })),
});

export const createShipmentSlice: StateCreator<ShipmentSlice, [], []> = (set) => ({
  shipment: null,
  addShipment: (shipment) => set((state) => ({ ...state, shipment })),
  resetShipment: () => set((state) => ({ ...state, shipment: null })),
});

export const createPiecesIdsSlice: StateCreator<PiecesIdsSlice, [], []> = (set) => ({
  piecesIds: [],
  addPiecesIds: (piecesIds) => set((state) => ({ ...state, piecesIds })),
  resetPiecesIds: () => set((state) => ({ ...state, piecesIds: [] })),
});

export const createPiecesSlice: StateCreator<PiecesSlice, [], []> = (set) => ({
  pieces: [],
  addPieces: (pieces) => set((state) => ({ ...state, pieces })),
  resetPieces: () => set((state) => ({ ...state, pieces: [] })),
});

export const createCommentsSlice: StateCreator<CommentsSlice, [], []> = (set) => ({
  comments: [],
  addComments: (comments) => set((state) => ({ ...state, comments })),
  resetCommnets: () => set((state) => ({ ...state, comments: [] })),
});
