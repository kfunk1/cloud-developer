import { APIGatewayProxyEvent } from 'aws-lambda';
import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const split = event.headers.Authorization.split(' ')
  const jwtToken = split[1]
  return parseUserId(jwtToken);
}

export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub;
}

