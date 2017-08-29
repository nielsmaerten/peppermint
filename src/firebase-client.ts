import RedditPost from "./reddit-post"
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
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
