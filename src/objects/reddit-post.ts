import * as crypto from "crypto"

export default class RedditPost {
  public id: string
  public type: string
  public width: number
  public height: number
  public dateAdded: number

  constructor(public imageUrl: string, public postUrl: string) {
    if (this.imageUrl === "") {
      throw new Error("Invalid URL!")
    } else {
      this.id = crypto
        .createHash("sha")
        .update(imageUrl)
        .digest("hex")
    }
  }
}
