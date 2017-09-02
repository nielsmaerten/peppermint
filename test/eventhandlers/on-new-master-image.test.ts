import { assert, expect } from "chai"
import Peppermint from "../../src/peppermint"
import RedditPost from "../../src/objects/reddit-post"
import StubCreator from "../helpers/stub-creator"
import * as admin from "firebase-admin"
import Config from "../../src/objects/config"

// A test event referring to one of the posts in the test reddit payload
let testEvent = require("../helpers/new-masterimage-event").event

describe("Peppermint.onNewMasterImage (getting img props)", () => {
  beforeAll(() => {
    // mock requestImageSize so we can spy on calls
    jest.mock("request-image-size")
  })

  it("should request properties of the new image", async () => {
    // trigger the event handler with the test event
    await Peppermint.onNewMasterImage(testEvent)

    // assert request-image-size was called with the url
    assert.equal(
      require("request-image-size").mock.calls[0][0],
      testEvent.data.imageUrl
    )
  })

  afterAll(() => {
    // restore the mock to its original, so it doesn't interfere with other tests
    jest.mock("request-image-size", () =>
      require.requireActual("request-image-size")
    )
  })
})

describe("Peppermint.onNewMasterImage", () => {
  beforeEach(async () => {
    // Stub firebase with test posts
    StubCreator.stubFirebase()
    StubCreator.stubRedditTopPosts()
    await Peppermint.onTriggerRedditUpdate()
  })

  afterEach(() => {
    StubCreator.restoreAll()
  })

  it("should store image properties with the image in firebase", async () => {
    // Get the event's test post from firebase
    let redditPost: RedditPost = (await admin
      .database()
      .ref(
        `${Config.masterListsRef}/${Config.subreddit}/${testEvent.params
          .postId}`
      )
      .once("value")).val()

    // Assert width and heigth are not (yet) defined
    assert.isUndefined(redditPost.width)
    assert.isUndefined(redditPost.height)

    // Manually fire the event of the post being added
    await Peppermint.onNewMasterImage(testEvent)

    // Get the test post back from firebase
    redditPost = (await admin
      .database()
      .ref(
        `${Config.masterListsRef}/${Config.subreddit}/${testEvent.params
          .postId}`
      )
      .once("value")).val()

    // Assert width and heigth are now defined
    assert.isDefined(redditPost.width)
    assert.isDefined(redditPost.height)
  })
})
