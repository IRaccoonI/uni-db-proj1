declare global {
  namespace Swagger {
    /**
     * object with detail of error
     */
    export interface ErrorResponse {
      status?: number;
      /**
       * error detail
       */
      message?: string;
      success?: boolean;
      reason?: string;
      [k: string]: unknown;
    }
    /**
     * User date to authorizate
     */
    export interface UserAuthorization {
      login: string;
      password: string;
      [k: string]: unknown;
    }
    export interface PostGet {
      id?: number;
      title?: string;
      text?: string;
      owner?: string;
      createdAt?: number;
      commentsCount?: number;
      likesCount?: number;
      [k: string]: unknown;
    }
  }

  interface Swagger {
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
            [k: string]: unknown;
          };
        };
      };
      '/roles': {
        GET: {
          response: {
            roleName: string;
            [k: string]: unknown;
          }[];
        };
      };
      '/posts': {
        GET: {
          query?: {
            validated?: boolean;
          };
          response: Swagger.PostGet[];
        };
        POST: {
          body?: {
            title: string;
            content: string;
            withoutVerification?: boolean;
            [k: string]: unknown;
          };
          response: {
            id: number;
            [k: string]: unknown;
          };
        };
      };
    };
  }
}

export {};
