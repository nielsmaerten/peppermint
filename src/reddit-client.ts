import RedditPost from "./reddit-post"

export default class RedditClient {
  public static getTopPosts(subreddit: string): Promise<RedditPost[]> {
    throw new Error("Implementation pending")
  }

  public static parseResponse(data: any): RedditPost[] {
    return [new RedditPost("")]
  }
}
