import RedditClient from "../src/reddit-client"
import RedditPost from "../src/reddit-post"
import { expect, assert } from "chai"
import * as sinon from "sinon"

// tslint:disable:no-unused-expression
describe("RedditClient", () => {
  it("should get the top posts from a subreddit", done => {
    RedditClient.getTopPosts()
      .then(posts => {
        expect(posts).not.to.be.undefined
        expect(posts.length).to.be.least(1)
        done()
      })
      .catch(fail)
  })

  it("should parse a response from reddit to posts", () => {
    let example = require("./reddit-test-payload")

    let posts = RedditClient.parseResponse(example.json)
    expect(posts).not.to.be.undefined

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
    expect(() => {
      new RedditPost("")
    }).to.throw()
  })

  it("should create an id for a new RedditPost", () => {
    let post = new RedditPost("http://example.com/image.jpg")
    assert.equal(post.id, "httpexamplecomimagejpg")
  })
})
