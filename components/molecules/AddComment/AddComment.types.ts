import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";

export interface IAddComment {
  refetch?: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<string[], Error>>;
}

export interface CommentForm {
  comment: string;
}
