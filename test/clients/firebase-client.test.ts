import * as Q from "q"
import { assert, expect } from "chai"
import FirebaseClient from "../../src/clients/firebase-client"
import RedditClient from "../../src/clients/reddit-client"
import RedditPost from "../../src/objects/reddit-post"
import StubCreator from "../helpers/stub-creator"

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
