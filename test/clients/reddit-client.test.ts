import { assert, expect } from "chai"
import RedditClient from "../../src/clients/reddit-client"
import RedditPost from "../../src/objects/reddit-post"

describe("RedditClient", () => {
  it("should get the top posts from a subreddit", async () => {
    let posts = await RedditClient.GET_TOP_POSTS()
    assert.isDefined(posts)
    expect(posts.length).to.be.least(1)
  })

  it("should parse a response from reddit to posts", () => {
    let example = require("../helpers/reddit-test-payload")

    let posts = RedditClient.PARSE_RESPONSE(example.json)
    assert.isDefined(posts)

    posts.forEach(post => {
      expect(post).to.have.property("imageUrl")
    })

    expect(posts[0].imageUrl).to.equal("https://i.redd.it/txbc6xxcf8hz.jpg")
  })

  it("should reject a failed api request", done => {
    let invalidUrl =
      "THIS-URL-DOES-NOT-EXIST-656b21d51aad04b7297cd1a7b63db9ebed1a08ed"
    expect(RedditClient.GET_TOP_POSTS(invalidUrl).catch(done))
  })

  it("should reject a new RedditPost with an empty url", () => {
    assert.throw(() => new RedditPost(""))
  })

  it("should create an id for a new RedditPost", () => {
    let post = new RedditPost("http://example.com/image.jpg")
    assert.equal(post.id, "7fe4804da7f85b2118f8bb341f838b1e3af52994")
  })
})
