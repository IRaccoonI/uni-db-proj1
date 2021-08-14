declare global {
  export namespace Swagger {
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
    export interface PostGetLight {
      id: number;
      title: string;
      content: string;
      owner: {
        id: number;
        login: string;
        [k: string]: unknown;
      };
      updatedAt: string;
      commentsCount: number;
      likesSum: number;
      latsVerification: {
        id: number;
        result: boolean;
        reson: string;
        [k: string]: unknown;
      };
      [k: string]: unknown;
    }
    export interface PostGetDetail {
      id: number;
      title: string;
      content: string;
      owner: {
        id: number;
        login: string;
        [k: string]: unknown;
      };
      createdAt: number;
      commentsCount: number;
      likesCount: number;
      [k: string]: unknown;
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
            verificationResult?: 'null' | 'true' | 'false';
          };
          response: Swagger.PostGetLight[];
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
      '/posts/{id}': {
        GET: {
          params: {
            id: number;
          };
          response: Swagger.PostGetDetail;
        };
      };
      '/posts/{id}/verification': {
        PATCH: {
          body?: {
            result: boolean;
            reason?: string;
            [k: string]: unknown;
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
            [k: string]: unknown;
          };
          params: {
            id: number;
          };
        };
      };
    };
  }
}

export {};
