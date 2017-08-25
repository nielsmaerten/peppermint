import RedditPost from "./reddit-post"
import * as firebase from "firebase"
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import * as Q from "q"
import Config from "../src/config"

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

  public postExistsInMasterList(
    redditPost: RedditPost,
    subreddit?: string
  ): Q.Promise<boolean> {
    // TODO: Can this be done faster? Like batching?
    subreddit = subreddit || Config.subreddit
    let deferred = Q.defer<boolean>()

    admin
      .database()
      .ref(`${Config.masterListsRef}/${subreddit}/${redditPost.id}`)
      .once("value")
      .then((snaptshot: FirebaseDataSnapshot) => {
        deferred.resolve(snaptshot.val() !== null)
      })
      .catch(deferred.reject)

    return deferred.promise
  }
}
