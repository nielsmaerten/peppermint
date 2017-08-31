import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import Config from "../objects/config"
import RedditPost from "../objects/reddit-post"

export default class FirebaseClient {
  private static _instance: FirebaseClient

  private constructor() {
    /* istanbul ignore else */
    if (admin.apps.length === 0) {
      /*
        If length > 0, the app has already been
        initialized by the Cloud Functions Runtime
       */
      admin.initializeApp(functions.config().firebase)
    }
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new FirebaseClient()
    }
    return this._instance
  }

  public async addPost(post: RedditPost) {
    await admin
      .database()
      .ref(`${Config.masterListsRef}/${Config.subreddit}/${post.id}`)
      .set(post)
  }

  public async getPost(post: RedditPost, subreddit?: string) {
    // TODO: Can this be done faster? Like batching?
    subreddit = subreddit || Config.subreddit

    let snapshot = await admin
      .database()
      .ref(`${Config.masterListsRef}/${subreddit}/${post.id}`)
      .orderByChild("id")
      .once("value")
    return snapshot.val()
  }
}
