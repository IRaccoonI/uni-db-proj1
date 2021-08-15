declare global {
  export namespace Swagger {
    /**
     * object with detail of error
     */
    export interface ErrorResponse {
      status: number;
      /**
       * error detail
       */
      message: string;
      success: boolean;
      reason: string;
    }
    /**
     * User date to authorizate
     */
    export interface UserAuthorization {
      login: string;
      password: string;
    }
    export interface PostGetManage {
      id: number;
      title: string;
      content: string;
      owner: Swagger.Owner;
      updatedAt: string;
      latsVerification: Swagger.LastVerification;
    }
    export interface PostGetView {
      id: number;
      title: string;
      content: string;
      owner: Swagger.Owner;
      updatedAt: string;
      latsVerification: Swagger.LastVerification;
      likesSum: number;
      commentsCount: number;
      viewsCount: number;
    }
    export interface CommentsGet {
      id: number;
      postId: number;
      owner: Swagger.Owner;
      parnetCommentId: number;
      content: string;
      updatedAt: string;
    }
    export interface Owner {
      id: number;
      login: string;
    }
    export interface LastVerification {
      id: number;
      result: boolean;
      reason: string;
    }
  }

  export interface Swagger {
    version: '1';
    routes: {
      '/authorization/login': {
        POST: {
          body: Swagger.UserAuthorization;
          response: {
            /**
             * jwt token
             */
            token: string;
          };
        };
      };
      '/posts': {
        GET: {
          query?: {
            verificationResult?: 'null' | 'true' | 'false';
          };
          response: Swagger.PostGetView[];
        };
        POST: {
          body?: {
            title: string;
            content: string;
            withoutVerification?: boolean;
          };
          response: {
            id: number;
          };
        };
      };
      '/posts/manage': {
        GET: {
          query?: {
            verificationResult?: 'null' | 'true' | 'false';
          };
          response: Swagger.PostGetManage[];
        };
      };
      '/posts/{id}/comments': {
        GET: {
          params: {
            id: number;
          };
          response: Swagger.CommentsGet[];
        };
        POST: {
          body?: {
            content?: string;
            parentCommentId?: number;
          };
          params: {
            id: number;
          };
        };
      };
      '/posts/{id}/verification': {
        PATCH: {
          body?: {
            result: boolean;
            reason?: string;
          };
          params: {
            id: number;
          };
        };
      };
      '/posts/{id}/like': {
        POST: {
          body?: {
            value: -1 | 1;
          };
          params: {
            id: number;
          };
          response: {
            currentSelfLikeValue: number;
            currentSumLikes: number;
          };
        };
      };
      '/posts/{id}/incrementView': {
        POST: {
          params: {
            id: number;
          };
          response: {
            currentViewsCount: number;
          };
        };
      };
      '/comments/{id}/childs': {
        GET: {
          params: {
            id: number;
          };
          response: Swagger.CommentsGet[];
        };
        POST: {
          body?: {
            content: string;
          };
          params: {
            id: number;
          };
        };
      };
      '/roles': {
        GET: {
          response: {
            roleName: string;
          }[];
        };
      };
    };
  }
}

export {};
