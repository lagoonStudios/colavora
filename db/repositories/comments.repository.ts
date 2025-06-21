import { db } from "@/db";
import { commentsTable, TCommentInsertData } from "../schema/comments";
import { eq } from "drizzle-orm";

class CommentsRepository {
  private static instance: CommentsRepository;
  private constructor() {}

  static getInstance(): CommentsRepository {
    if (!CommentsRepository.instance) {
      CommentsRepository.instance = new CommentsRepository();
    }
    return CommentsRepository.instance;
  }

  /** Inserts multiple comments into the database */
  async insertMultiple(commentsArr: TCommentInsertData[]) {
    try {
      await db.insert(commentsTable).values(
        commentsArr.map((c) => ({
          comment: c.comment,
          shipmentID: c.shipmentID,
          createdDate: c.createdDate,
        }))
      );
    } catch (error) {
      console.error("🚀 ~ insertMultipleComments ~ error:", error);
      throw error;
    }
  }

  async getAll(params: { shipmentId: number }) {
    try {
      const { shipmentId } = params;
      return await db
        .select()
        .from(commentsTable)
        .where(eq(commentsTable.shipmentID, shipmentId));
    } catch (error) {
      console.error("🚀 ~ getAllShipmentsComments ~ error:", error);
      throw error;
    }
  }

  /** Deletes all comments from the database */
  deleteAll() {
    try {
      return db.delete(commentsTable);
    } catch (error) {
      console.error("🚀 ~ deleteAllComments ~ error:", error);
      throw error;
    }
  }
}

export type TCommentsRepository = CommentsRepository;
export const CommentsLocalService = CommentsRepository.getInstance();
