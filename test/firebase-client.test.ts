import FirebaseClient from "../src/firebase-client"
import RedditPost from "../src/reddit-post"
import { expect, assert } from "chai"

describe("Firebase Client", () => {
  it("should be a singleton", () => {
    let one = FirebaseClient.getInstance()
    let two = FirebaseClient.getInstance()

    assert.strictEqual(one, two)
  })

  it("should return a master list", () => {
    debugger
    let posts = FirebaseClient.getInstance().getMasterList()
    assert.isArray(posts)
    posts.forEach(post => assert.instanceOf(post, RedditPost))
  })
})
