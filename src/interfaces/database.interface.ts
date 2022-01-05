import { AxiosPromise } from 'axios';

export interface Database {
  readonly DATABASE_URL: string;
  readonly ADMIN_PASSWORD: string;

  comunicate(
    variables?: Record<string, unknown>,
    query?: string,
    opeartionName?: string,
    token?: string
  ): AxiosPromise;
}
