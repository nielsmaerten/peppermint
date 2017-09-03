import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import Config from "../objects/config"
import User from "../objects/user"
import RedditPost from "../objects/reddit-post"

export default class FirebaseClient {
  private static _instance: FirebaseClient

  private constructor() {
    admin.initializeApp(
      (global as any).peppermintFirebaseConfig || functions.config().firebase
    )
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

  public async setPostProperties(
    postId: string,
    properties: { width: number; height: number }
  ) {
    await admin
      .database()
      .ref(`${Config.masterListsRef}/${Config.subreddit}/${postId}`)
      .update({
        height: properties.height,
        width: properties.width
      })
  }

  public async addUser(user: User) {
    await admin.database().ref(`${Config.userListRef}/${user.id}`).set(user)
  }

  public async getInterestedUsers(redditpost: RedditPost): Promise<User[]> {
    let users: User[] = []
    let presortedUsers = (await admin
      .database()
      .ref(Config.userListRef)
      .orderByChild("prefMinWidth")
      .endAt(redditpost.width)
      .once("value")).val()

    for (let userId in presortedUsers) {
      if (presortedUsers[userId].prefMinHeight <= redditpost.height) {
        users.push(presortedUsers[userId])
      }
    }

    return users
  }

  public async addPostToUserList(post: RedditPost, userId: string) {
    await admin
      .database()
      .ref(
        `${Config.userListRef}/${userId}/${Config.personalLisRef}/${post.id}`
      )
      .set(post)
  }
}
