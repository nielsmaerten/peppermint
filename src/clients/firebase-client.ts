import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import Config from "../objects/config"
import RedditPost from "../objects/reddit-post"
import User from "../objects/user"

export default class FirebaseClient {
  private static _instance: FirebaseClient

  private constructor() {
    const config =
      (global as any).peppermintFirebaseConfig || functions.config()
    admin.initializeApp(config.firebase)
  }

  public static GET_INSTANCE() {
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
    properties: { width: number; height: number; type: string }
  ) {
    await admin
      .database()
      .ref(`${Config.masterListsRef}/${Config.subreddit}/${postId}`)
      .update({
        height: properties.height,
        width: properties.width,
        type: properties.type
      })
  }

  public async addUser(user: User) {
    await admin
      .database()
      .ref(`${Config.userListRef}/${user.id}`)
      .update(user)
  }

  public async getUser(userId: string): Promise<User> {
    const snapshot = await admin
      .database()
      .ref(`${Config.userListRef}/${userId}`)
      .once("value")
    return snapshot.val()
  }

  public async updateUser(userId: string, updates: any) {
    await admin
      .database()
      .ref(`${Config.userListRef}/${userId}`)
      .update(updates)
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

  public async getUserToken(userId: string): Promise<string> {
    return (await admin
      .database()
      .ref(`${Config.userListRef}/${userId}/token`)
      .once("value")).val() as string
  }
}
