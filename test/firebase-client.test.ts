import FirebaseClient from "../src/firebase-client"
import RedditPost from "../src/reddit-post"
import { expect, assert } from "chai"

describe("Firebase Client", () => {
  beforeAll(() => {
    require("./firebase-mock-creator").initMockFirebase()
  })

  it("should be a singleton", () => {
    let one = FirebaseClient.getInstance()
    let two = FirebaseClient.getInstance()

    assert.strictEqual(one, two)
  })

  it("should return a master list", done => {
    let posts = FirebaseClient.getInstance().getMasterList().then(posts => {
      // TODO:add mock data to pass this test
      assert.isArray(posts)
      posts.forEach(post => assert.instanceOf(post, RedditPost))
      done()
    })
  })
})
