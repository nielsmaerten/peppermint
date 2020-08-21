import FirebaseClient from "../clients/firebase-client"
import Config from "../objects/config"
import RedditPost from "../objects/reddit-post"
import User from "../objects/user"

export default async (req: any): Promise<string> => {
  const functions = require("firebase-functions")
  const firebaseConfig =
    (global as any).peppermintFirebaseConfig || functions.config()

  console.log("Exchanging auth code with Dropbox API for an access token...")
  let response = await exchangeDropboxToken(firebaseConfig, req.query.code)
  console.log("Success. Storing access token in database...")

  try {
    await FirebaseClient.GET_INSTANCE().addUser(
      new User(response.access_token, response.account_id)
    )
  } catch (error) {
    throw new Error(
      `Add user failed. Error: ${error} | Dropbox response: ${response}`
    )
  }

  let welcomePost = new RedditPost(
    "https://peppermint-wallpapers.web.app/welcome.jpg",
    "https://unsplash.com/photos/pAoo1Rs1Yy8"
  )
  welcomePost.dateAdded = 0
  welcomePost.height = 3646
  welcomePost.width = 6000
  welcomePost.id = "welcome"
  welcomePost.type = "jpg"
  await FirebaseClient.GET_INSTANCE().addPostToUserList(
    welcomePost,
    response.account_id
  )

  const customToken = await FirebaseClient.GET_INSTANCE().getUserSignInToken(
    response.account_id
  )

  return `${firebaseConfig.oauth.redirect_after_connect}#token=${customToken}`
}

function exchangeDropboxToken(
  firebaseConfig: any,
  dropboxCode: string
): Promise<DropboxToken> {
  return new Promise<DropboxToken>((resolve, reject) => {
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
      (error: any, httpResponse: any, body: DropboxToken) => {
        if (error) reject(error)
        else resolve(body)
      }
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
