import FirebaseClient from "../clients/firebase-client"
import Config from "../objects/config"
import User from "../objects/user"

export default async (req: any): Promise<string> => {
  const functions = require("firebase-functions")
  const firebaseConfig =
    (global as any).peppermintFirebaseConfig || functions.config()

  console.log("Exchanging auth code with Dropbox API for an access token...")
  let response = await exchangeDropboxToken(firebaseConfig, req.query.code);
  console.log("Success. Storing access token in database...")

  await FirebaseClient.GET_INSTANCE().addUser(
    new User(response.access_token, response.account_id)
  )

  await FirebaseClient.GET_INSTANCE().addPostToUserList({
    dateAdded: 0,
    height: 3646,
    width: 6000,
    id: "welcome",
    type: "jpg",
    imageUrl: "https://peppermint-wallpapers.firebaseapp.com/welcome.jpg"
  }, response.account_id)

  return firebaseConfig.oauth.redirect_after_connect
}

function exchangeDropboxToken(firebaseConfig: any, dropboxCode: string): Promise<DropboxToken> {
  return new Promise<DropboxToken>(resolve => {
    require("request").post(
      {
        json: true,
        url: Config.dropbox.oauthUri,
        formData: {
          code: dropboxCode,
          grant_type: "authorization_code",
          redirect_uri: firebaseConfig.dropbox.redirect_uri
        },
        auth: {
          user: firebaseConfig.dropbox.client_id,
          pass: firebaseConfig.dropbox.client_secret
        }
      },
      (response: DropboxToken) => resolve(response)
    )
  })
}

// tslint:disable variable-name
class DropboxToken {
  access_token: string
  account_id: string
  token_type: string
  uid: string
}
