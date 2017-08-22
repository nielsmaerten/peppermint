import RedditPost from "./reddit-post"

export default class RedditClient {
  public static getTopPosts(subreddit: string): Promise<RedditPost[]> {
    throw new Error("Implementation pending")
  }

  public static parseResponse(payload: any): RedditPost[] {
    if (typeof payload === "string") {
      payload = JSON.parse(payload)
    }

    // tslint:disable-next-line:no-unexpected-multiline
    let posts: RedditPost[] = []
    for (let i = 0; i < payload.data.children.length; i++) {
      let element = payload.data.children[i]
      if (element.data.preview) {
        posts.push(new RedditPost(element.data.preview.images[0].source.url))
      }
    }
    return posts
  }
}
