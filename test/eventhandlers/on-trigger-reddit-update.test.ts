import { assert } from "chai"
import * as sinon from "sinon"
import FirebaseClient from "../../src/clients/firebase-client"
import RedditClient from "../../src/clients/reddit-client"
import Config from "../../src/objects/config"
import RedditPost from "../../src/objects/reddit-post"
import Peppermint from "../../src/peppermint"
import StubCreator from "../helpers/stub-creator"

describe("Peppermint.onTriggerRedditUpdate", () => {
  let firebase: FirebaseClient
  let admin: any
  beforeEach(() => {
    StubCreator.STUB_FIREBASE()
    StubCreator.STUB_REDDIT_TOP_POSTS()
    firebase = FirebaseClient.GET_INSTANCE()
    admin = require("firebase-admin")
  })
  afterEach(StubCreator.restoreAll)

  it("should add items from Reddit to Firebase", async () => {
    // Confirm firebase is empty
    assert.isNull(
      admin
        .database()
        .ref(Config.masterListsRef)
        .getData()
    )

    // Fill firebase with posts from reddit
    await Peppermint.onTriggerRedditUpdate()

    // Confirm data is present in Firebase
    assert.isNotNull(
      admin
        .database()
        .ref(Config.masterListsRef)
        .getData()
    )
  })

  it("should add a new item to Firebase", async () => {
    // Put some testdata in Firebase
    await Peppermint.onTriggerRedditUpdate()

    // Add a new post to Reddit
    let newPost = new RedditPost("XXXXX")
    await StubCreator.ADD_POST_TO_STUB(newPost)

    // Verify the post has been added
    assert((await RedditClient.GET_TOP_POSTS()).indexOf(newPost) !== -1)

    // This post is not in Firebase
    assert.isNull(await firebase.getPost(newPost))

    // Spy on the addPost function
    let spy = sinon.spy(firebase, "addPost")

    // Sync firebase with Reddit
    await Peppermint.onTriggerRedditUpdate()

    // firebase.addPost should have been caled exactly once
    assert(spy.calledOnce)

    // Firebase should have the post now
    assert.isNotNull(await firebase.getPost(newPost))
  })
})
