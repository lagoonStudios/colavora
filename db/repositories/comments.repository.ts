import { db } from "@/db";
import {
  commentsTable,
  TCommentInsertData,
  TCommentsData,
} from "../schema/comments";
import { inArray, eq } from "drizzle-orm";

class CommentsRepositoryInstance {
  private static instance: CommentsRepositoryInstance;
  private constructor() {}

  static getInstance(): CommentsRepositoryInstance {
    if (!CommentsRepositoryInstance.instance) {
      CommentsRepositoryInstance.instance = new CommentsRepositoryInstance();
    }
    return CommentsRepositoryInstance.instance;
  }

  /** Inserts multiple comments into the database */
  async insertMultipleComments(commentsArr: TCommentInsertData[]) {
    try {
      console.log("Inserting comments: ", commentsArr);
      await db.insert(commentsTable).values(commentsArr);
    } catch (error) {
      console.error("🚀 ~ insertMultipleComments ~ error:", error);
      throw error;
    }
  }

  async getAllShipmentsComments(params: { shipmentId: number }) {
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
  deleteAllComments() {
    return db.delete(commentsTable);
  }
}

export type CommentsRepository = CommentsRepositoryInstance;
export const CommentsRepository = CommentsRepositoryInstance.getInstance();
