import RedditPost from "./reddit-post"
import * as firebase from "firebase"
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import * as Q from "q"

export default class FirebaseClient {
  private static _instance: FirebaseClient

  private constructor() {
    admin.initializeApp(functions.config().firebase)
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new FirebaseClient()
    }
    return this._instance
  }

  public getMasterList(subreddit?: string): Q.Promise<RedditPost[]> {
    let deferred = Q.defer<RedditPost[]>()

    admin
      .database()
      .ref(`/masterlists/${subreddit}`)
      .once("value")
      .then((snaptshot: firebase.database.DataSnapshot) => {
        deferred.resolve(snaptshot.val())
      })
      .catch(deferred.reject)

    return deferred.promise
  }
}
