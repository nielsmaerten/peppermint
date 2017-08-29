import RedditClient from "../src/reddit-client"
import RedditPost from "../src/reddit-post"
import { expect, assert } from "chai"
import * as sinon from "sinon"

describe("RedditClient", () => {
  it("should get the top posts from a subreddit", async () => {
    let posts = await RedditClient.getTopPosts()
    assert.isDefined(posts)
    expect(posts.length).to.be.least(1)
  })

  it("should parse a response from reddit to posts", () => {
    let example = require("./reddit-test-payload")

    let posts = RedditClient.parseResponse(example.json)
    assert.isDefined(posts)

    posts.forEach(post => {
      expect(post).to.have.property("imageUrl")
    })

    expect(posts[0].imageUrl).to.equal(
      "https://i.redditmedia.com/ycDpouFO79-fN1NVCUZUbfxBO4sUlXdB2zTDsJBHxa8.jpg?s=68041c0aaa86722789e4bed8dabe1388"
    )
  })

  it("should reject a failed api request", done => {
    let invalidUrl = "http://example.com/404"
    expect(RedditClient.getTopPosts(invalidUrl).catch(done))
  })

  it("should reject a new RedditPost with an empty url", () => {
    assert.throw(() => new RedditPost(""))
  })

  it("should create an id for a new RedditPost", () => {
    let post = new RedditPost("http://example.com/image.jpg")
    assert.equal(post.id, "7fe4804da7f85b2118f8bb341f838b1e3af52994")
  })
})
