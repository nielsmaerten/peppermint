import FirebaseClient from "../src/firebase-client"
import RedditPost from "../src/reddit-post"
import RedditClient from "../src/reddit-client"
import StubCreator from "./stub-creator"
import { expect, assert } from "chai"
import * as Q from "q"

describe("Firebase Client", () => {
  beforeEach(StubCreator.stubFirebase)
  afterEach(StubCreator.restoreFirebase)

  it("should be a singleton", () => {
    let one = FirebaseClient.getInstance()
    let two = FirebaseClient.getInstance()

    assert.strictEqual(one, two)
  })

  it("should add a post to Firebase", async () => {
    let firebase = FirebaseClient.getInstance()
    let post = new RedditPost("this-is-some-random-stuff")

    assert.isNull(await firebase.getPost(post))
    await firebase.addPost(post)
    assert.isNotNull(await firebase.getPost(post))
  })
})
