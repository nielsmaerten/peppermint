import RedditPost from "./reddit-post"

export default class FirebaseClient {
  private static _instance: FirebaseClient
  private _masterList: RedditPost[]
  private constructor() {
    this._masterList = []
  }

  public static getInstance() {
    if (this._instance === undefined) {
      this._instance = new FirebaseClient()
    }
    return this._instance
  }

  public getMasterList(): RedditPost[] {
    return this._masterList
  }
}
