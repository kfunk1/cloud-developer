// TODO:DONE Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'eg88n7r7hj'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO:DONE Create an Auth0 application and copy values from it into this map
  domain: 'kfunk.us.auth0.com',            // Auth0 domain
  clientId: 'tEFZqstYttAq09CUn4QM6QzBRSfC2hAR',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
