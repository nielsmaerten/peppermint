import { assert, expect } from "chai"
import Peppermint from "../../src/peppermint"
import RedditPost from "../../src/objects/reddit-post"
import StubCreator from "../helpers/stub-creator"
import * as admin from "firebase-admin"
import Config from "../../src/objects/config"

describe("Peppermint.onNewMasterImage", () => {
  let event = require("../helpers/new-masterimage-event").event
  it("should get the properties of the new image", async () => {
    // Setup mock request-image-size and example event
    jest.mock("request-image-size")

    // trigger the event handler
    await Peppermint.onNewMasterImage(event)

    // assert request-image-size was called
    assert.equal(
      require("request-image-size").mock.calls[0] /*function-arguments*/[0],
      event.data.imageUrl,
      "Expected 'image-request size' to have been called with test url"
    )
  })

  it("should store image properties with the image in firebase", async () => {
    // Stub firebase with test posts
    StubCreator.stubFirebase()
    StubCreator.stubRedditTopPosts()
    await Peppermint.onTriggerRedditUpdate()

    // Get the test post back from firebase
    // Event is a test event referring to one of the test posts
    let redditPost: RedditPost = (await admin
      .database()
      .ref(
        `${Config.masterListsRef}/${Config.subreddit}/${event.params.postId}`
      )
      .once("value")).val()

    // Assert width and heigth are not defined
    assert.isUndefined(redditPost.width)
    assert.isUndefined(redditPost.height)

    // Manually fire an event for the first post being added
    await Peppermint.onNewMasterImage(event)

    // Get the test post back from firebase
    redditPost = (await admin
      .database()
      .ref(
        `${Config.masterListsRef}/${Config.subreddit}/${event.params.postId}`
      )
      .once("value")).val()

    // Assert width and heigth are now defined
    assert.isDefined(redditPost.width)
    assert.isDefined(redditPost.height)

    StubCreator.restoreAll()
  })
})
