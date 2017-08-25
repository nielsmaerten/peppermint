export default class RedditPost {
  public id: string
  constructor(public imageUrl: string) {
    let regexMatches = imageUrl.match(/\w+/g)
    if (regexMatches != null) {
      this.id = regexMatches.join("")
    } else {
      throw new Error("Invalid URL!")
    }
  }
}
