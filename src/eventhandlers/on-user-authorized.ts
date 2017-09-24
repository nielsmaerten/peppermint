import FirebaseClient from "../clients/firebase-client"
import Config from "../objects/config"
import User from "../objects/user"

export default async (req: any): Promise<string> => {
  const request = require("request-promise")
  const functions = require("firebase-functions")
  const firebaseConfig =
    (global as any).peppermintFirebaseConfig || functions.config()

  console.log("Exchanging auth code with Dropbox API for an access token...")
  let response: DropboxToken = await request.post({
    json: true,
    url: Config.dropbox.oauthUri,
    formData: {
      code: req.query.code,
      grant_type: "authorization_code",
      redirect_uri: firebaseConfig.dropbox.redirect_uri
    },
    auth: {
      user: firebaseConfig.dropbox.client_id,
      pass: firebaseConfig.dropbox.client_secret
    }
  })
  console.log("Success. Storing access token in database...")

  await FirebaseClient.GET_INSTANCE().addUser(
    new User(response.access_token, undefined, undefined, response.account_id)
  )

  return firebaseConfig.oauth.redirect_after_connect
}

// tslint:disable variable-name
class DropboxToken {
  access_token: string
  account_id: string
  token_type: string
  uid: string
}