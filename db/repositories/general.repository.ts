import { IFetchUserData } from "@constants/types/general";
import { CODLocalService } from "./cod.repository";
import { CommentsLocalService } from "./comments.repository";
import { ExceptionLocalService } from "./exceptions.repository";
import { ManifestsLocalService } from "./manifests.repository";
import { PiecesLocalService } from "./pieces.repository";
import { ShipmentLocalService } from "./shipments.repository";
import { fetchData, fetchDataOptions } from "@utils/functions";
import { TManifestInsertData } from "../schema/manifests";
import { TShipmentInsertData } from "../schema/shipments";
import { TPiecesInsertData } from "../schema/pieces";
import { TCommentInsertData } from "../schema/comments";

class GeneralRepository {
  private static instance: GeneralRepository;
  private constructor() {}

  public static getInstance(): GeneralRepository {
    if (!GeneralRepository.instance) {
      GeneralRepository.instance = new GeneralRepository();
    }
    return GeneralRepository.instance;
  }

  async dropTables(): Promise<void> {
    try {
      await Promise.all([
        ManifestsLocalService.deleteAll(),
        ShipmentLocalService.deleteAll(),
        PiecesLocalService.deleteAll(),
        CommentsLocalService.deleteAll(),
        CODLocalService.deleteAll(),
        ExceptionLocalService.deleteAll(),
      ]);
      return;
    } catch (error) {
      console.error("🚀 ~ GeneralRepository ~ dropTables ~ error:", error);
      throw error;
    }
  }

  async resetDatabase(
    user: IFetchUserData,
    options: fetchDataOptions
  ): Promise<{
    manifests: TManifestInsertData[];
    shipments: TShipmentInsertData[];
    pieces: TPiecesInsertData[];
    comments: TCommentInsertData[];
  }> {
    try {
      const data = await fetchData(user, options);
      try {
        await this.dropTables();
      } catch (error) {
        console.error(
          "🚀 ~ GeneralRepository ~ resetDatabase ~ dropTables ~ error:",
          error
        );
        throw error;
      }

      const { manifests, shipments, pieces, comments } = data;

      if (options?.setModalMessage)
        options?.setModalMessage(
          options?.t?.("MODAL.SAVING_MANIFESTS") || "Saving manifests"
        );

      try {
        await ManifestsLocalService.insertMultiple(manifests);
      } catch (error) {
        console.error(
          "🚀 ~ GeneralRepository ~ resetDatabase ~ insertMultipleManifests ~ error:",
          error
        );
        throw error;
      }

      if (options?.setModalMessage)
        options?.setModalMessage(
          options?.t?.("MODAL.SAVING_SHIPMENTS") || "Saving shipments"
        );

      try {
        await ShipmentLocalService.insertMultiple(shipments);
      } catch (error) {
        console.error(
          "🚀 ~ GeneralRepository ~ resetDatabase ~ insertMultipleShipments ~ error:",
          error
        );
        throw error;
      }

      if (options?.setModalMessage)
        options?.setModalMessage(
          options?.t?.("MODAL.SAVING_PIECES") || "Saving pieces"
        );

      try {
        Promise.all([
          PiecesLocalService.insertMultiple(pieces),
          CommentsLocalService.insertMultiple(comments),
        ]);
      } catch (error) {
        console.error(
          "🚀 ~ GeneralRepository ~ resetDatabase ~ insertMultiplePieces / insertMultipleComments ~ error:",
          error
        );
        throw error;
      }

      return data;
    } catch (error) {
      console.error("🚀 ~ GeneralRepository ~ resetDatabase ~ error:", error);
      throw error;
    }
  }

  async getHomeCounters(): Promise<{
    todayShipmentsCount: number;
    manifestsCount: number;
  }> {
    try {
      const [todayShipments, manifests] = await Promise.all([
        ShipmentLocalService.getTodayShipments(),
        ManifestsLocalService.getCount(),
      ]);

      const todayShipmentsCount = todayShipments?.count ?? 0;
      const manifestsCount = manifests?.count ?? 0;

      return { todayShipmentsCount, manifestsCount };
    } catch (error) {
      console.error("🚀 ~ GeneralRepository ~ getHomeCounters ~ error:", error);
      throw error;
    }
  }
}

export type GeneralRepositoryType = GeneralRepository;
export const GeneralLocalService = GeneralRepository.getInstance();
