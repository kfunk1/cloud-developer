import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../../auth/JwtPayload'

const cert = `-----BEGIN CERTIFICATE-----
MIIC/zCCAeegAwIBAgIJcjkpdKq21iWqMA0GCSqGSIb3DQEBCwUAMB0xGzAZBgNV
BAMTEmtmdW5rLnVzLmF1dGgwLmNvbTAeFw0yMDEyMjMxNjAzMTlaFw0zNDA5MDEx
NjAzMTlaMB0xGzAZBgNVBAMTEmtmdW5rLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZI
hvcNAQEBBQADggEPADCCAQoCggEBAN4bOp/YpCY2yO+CZzw2ofWltsEO2ViI6gHe
pgNSwstwW0pfvX3PKMyXNYumTGfphwFH5PH5LgHN/Yd2PCYhq41DndOgDXXbKYFI
Zs5eFYCi5FsVu/hUbSTWTkS4zhkTdktLgoQDBKLy+9zpuMuJ9FXYDv7Sak2g53n3
yQGxUxlGq/96Ra2I0csk0Fd+YwE4e6DxOqUgVZ+mEbnQMreEKjBqGVwunfpH6ldQ
c/5fUeIyic/dPjnEXby00ZWAhAlRnSzrWjzKovwB6y81qt38KQDLwIftNFQQR20M
bQCQuYFO0YMQNa9pNgReiu0BXNYn8auk4I/+6XqlhITVDi0yPj0CAwEAAaNCMEAw
DwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQU83fhT+DuaDU60k/wiHqCBc9n+9Ew
DgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQAhYjk2CfXHFpa08bcH
/Uj3atUkqFj0m1pqDiSTfrjK/p36z3AzaViY/1yM7SGxLy2VGLz7omPUlcT15hP/
Wptd2q1n7tdsJaD9BXTirgk9FFmy2D4p9h9+OSrAhHVro2Mz4kWXwc6g14mdSjXw
oxiBLkPE1JbMSsRXsJWA5ljxVNTw8dgRVlRqrvWR+7TFnjieh0iD+oOjnwdozpp1
b+I06iex/AQFuXVnluPnSYaNZWpZaIkUW/A4OwUyTVl4rjb6y9buPpWPJoFjycIy
GQgKpI7aAVA55l0CXw+dGEDSyeic9JAHZDl66AV7p24Fp2u58h6BqAhzdQg+tYEx
sbDo
-----END CERTIFICATE-----`

// TODO:DONE Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    console.log('event.authorizationToken', event.authorizationToken)
    const jwtToken = await verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User not authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  // TODO:DONE Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  if (!authHeader) {
    throw new Error('No authentication header')
  }

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authentication header')
  }

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, {
    algorithms: ['RS256']
  }) as JwtPayload
}
