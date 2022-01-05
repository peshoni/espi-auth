export interface Token {
  /** The user full name with middle name as B. */
  name: string;
  /** Is the user is admin */
  admin: boolean;
  /** Hasura custom claim section */
  'https://hasura.io/jwt/claims': CustomClaims;
  /** Issuer */
  iss: string;
  /** Auditory */
  aud: string;
  /** Authentication time */
  auth_time: number;
  /** self explanatory */
  user_id: string;
  /** sub */
  sub: string;
  /** issued at time */
  iat: number;
  /** expiration */
  exp: number;
  email: string;
  email_verified?: boolean;
}

export interface CustomClaims {
  'x-hasura-default-role': string;
  'x-hasura-allowed-roles': ['admin', 'user'];
  'x-hasura-user-id': string;
  'x-hasura-company-id': string;
  active: boolean;
  manager?: boolean;
  user?: boolean;
  cashier?: boolean;
  nap?: boolean;
  admin?: boolean;
}

export interface SignedToken {
  token: string;
  expires: number;
}
