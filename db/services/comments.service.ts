import { CommentsRepository } from "../repositories/comments.repository";
import { TCommentInsertData } from "../schema/comments";

class CommentsServiceInstance {
  private static instance: CommentsServiceInstance;
  private readonly commentsRepository: CommentsRepository;
  private constructor() {
    this.commentsRepository = CommentsRepository;
  }

  static getInstance(): CommentsServiceInstance {
    if (!CommentsServiceInstance.instance) {
      CommentsServiceInstance.instance = new CommentsServiceInstance();
    }
    return CommentsServiceInstance.instance;
  }

  /** Inserts multiple comments into the database */
  insertMultipleComments(comments: TCommentInsertData[]) {
    return this.commentsRepository.insertMultipleComments(comments);
  }

  /** Gets all comments for a specific shipment */
  getAllShipmentsComments(params: { shipmentId: number }) {
    return this.commentsRepository.getAllShipmentsComments(params);
  }

  /** Deletes all comments from the database */
  deleteAllComments() {
    return this.commentsRepository.deleteAllComments();
  }
}

export type CommentsService = CommentsServiceInstance;
export const CommentsService = CommentsServiceInstance.getInstance();
