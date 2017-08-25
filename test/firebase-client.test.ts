import FirebaseClient from "../src/firebase-client"
import RedditPost from "../src/reddit-post"
import FirebaseMockCreator from "./firebase-mock-creator"
import { expect, assert } from "chai"
import * as Q from "q"

describe("Firebase Client", () => {
  beforeAll(done => {
    FirebaseMockCreator.initMockFirebase().then(done)
  })

  it("should be a singleton", () => {
    let one = FirebaseClient.getInstance()
    let two = FirebaseClient.getInstance()

    assert.strictEqual(one, two)
  })

  it("should check if a post already exists in the masterlist", done => {
    let existingPost = FirebaseMockCreator.examplePosts[0]
    let newPost = new RedditPost("this-post-does-not-exist-in-the-masterlist")

    let p1 = FirebaseClient.getInstance().postExistsInMasterList(existingPost)
    let p2 = FirebaseClient.getInstance().postExistsInMasterList(newPost)

    Q.all([p1, p2]).then(results => {
      try {
        assert(results[0] === true)
        assert(results[1] === false)
      } catch (error) {
        fail(error)
      } finally {
        done()
      }
    })
  })
})
