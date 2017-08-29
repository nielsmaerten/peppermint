import Peppermint from "../src/peppermint"
import FirebaseClient from "../src/firebase-client"
import RedditPost from "../src/reddit-post"
import RedditClient from "../src/reddit-client"
import StubCreator from "./stub-creator"
import Config from "../src/config"
import { expect, assert } from "chai"
import * as sinon from "sinon"
import * as Q from "q"

/**
 * Main Peppermint tests
 */
describe("Peppermint.onCheckReddit", () => {
  let firebase: FirebaseClient
  let admin: any
  beforeEach(() => {
    StubCreator.stubFirebase()
    StubCreator.stubRedditTopPosts()
    firebase = FirebaseClient.getInstance()
    admin = require("firebase-admin")
  })
  afterEach(StubCreator.restoreAll)

  it("should add items from Reddit to Firebase", async () => {
    // Confirm firebase is empty
    assert.isNull(admin.database().ref(Config.masterListsRef).getData())

    // Fill firebase with posts from reddit
    await Peppermint.onCheckReddit()

    // Confirm data is present in Firebase
    assert.isNotNull(admin.database().ref(Config.masterListsRef).getData())
  })

  it("should add a new item to Firebase", async () => {
    // Put some testdata in Firebase
    await Peppermint.onCheckReddit()

    // Add a new post to Reddit
    let newPost = new RedditPost("XXXXX")
    await addPostToStub(newPost)

    // This post is not in Firebase
    assert.isNull(await firebase.getPost(newPost))

    // Spy on the addPost function
    let spy = sinon.spy(firebase, "addPost")

    // Sync firebase with Reddit
    await Peppermint.onCheckReddit()

    // firebase.addPost should have been caled exactly once
    assert(spy.calledOnce)

    // Firebase should have the post now
    assert.isNotNull(await firebase.getPost(newPost))
  })
})

/**
 * Gets the current list of top posts from RedditClient.getTopPosts.
 * Then adds @param newPost to the list, and stubs RedditClient with the new list
 * @param newPost New post to add to the mock getTopPosts call
 */
let addPostToStub = async (newPost: RedditPost) => {
  // Get the current list of topPosts
  let posts = await RedditClient.getTopPosts()

  // Restore the stub to its original state
  ;(RedditClient.getTopPosts as any).restore()

  // Add the newPost to the list
  posts.push(newPost)

  // Re-stub with the augmented list
  sinon.stub(RedditClient, "getTopPosts").returns(Q.resolve(posts))

  // Verify the post has been added
  assert((await RedditClient.getTopPosts()).indexOf(newPost) !== -1)
}
