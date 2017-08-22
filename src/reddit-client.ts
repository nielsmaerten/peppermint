import RedditPost from "./reddit-post"
import request from "request"
import Q from "q"
import Config from "./config"

export default class RedditClient {
  /**
   * Fetches top posts from a subreddit, and returns them as an array of <RedditPost>
   * @param subreddit name of the subreddit to get posts from, including /r/. Eg: /r/earthporn. Defaults to /r/earthporn if undefined
   * @param topPostCount number of posts to get. defaults to 10
   */
  public static getTopPosts(
    subreddit?: string,
    topPostCount?: number
  ): Q.Promise<RedditPost[]> {
    let deferred = Q.defer<RedditPost[]>()

    // build the requestUrl
    subreddit = subreddit || Config.subreddit
    topPostCount = topPostCount || Config.topPostCount
    let requestUrl = `${subreddit}/top/.json?count=${topPostCount}`.toLowerCase()

    // fire off the request
    request.get(
      requestUrl,
      { baseUrl: Config.redditBaseUrl },
      (error, response, body) => {
        if (error) deferred.reject(error)
        else deferred.resolve(this.parseResponse(body))
      }
    )

    // return promise
    return deferred.promise
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
