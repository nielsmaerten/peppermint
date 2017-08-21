import RedditClient from "../src/reddit-client"
import RedditPost from "../src/reddit-post"
import { expect, assert } from "chai"
import * as sinon from "sinon"

describe("RedditClient", () => {
  let json = {}

  it("should get the top posts from a subreddit", () => {
    RedditClient.getTopPosts("/r/earthporn").then(posts => {
      expect(posts).not.to.be.undefined
      expect(posts.length).to.be.least(1)
    })
  })

  it("should parse a response from reddit to posts", () => {
    let posts = RedditClient.parseResponse(json)
    expect(posts).not.to.be.undefined
    posts.forEach(post => {
      expect(post).to.have.property("imageUrl")
    })
  })
})
