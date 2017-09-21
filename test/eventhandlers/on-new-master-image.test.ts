import { assert, expect } from "chai"
import * as admin from "firebase-admin"
import FirebaseClient from "../../src/clients/firebase-client"
import Config from "../../src/objects/config"
import RedditPost from "../../src/objects/reddit-post"
import User from "../../src/objects/user"
import Peppermint from "../../src/peppermint"
import StubCreator from "../helpers/stub-creator"

describe("Peppermint.onNewMasterImage", () => {
  // test event referring to one of the posts in the test reddit payload
  let testEvent = require("../helpers/new-masterimage-event").event
  testEvent.data.val = () => testEvent.data

  beforeEach(async () => {
    // Stub firebase with test posts
    StubCreator.stubFirebase()
    StubCreator.stubRedditTopPosts()
    await Peppermint.onTriggerRedditUpdate()

    // mock requestImageSize so we can spy on calls
    jest.mock("request-image-size", () =>
      jest.fn(() => {
        return { width: 1337, height: 42 }
      })
    )
  })

  afterEach(() => {
    StubCreator.restoreAll()
  })

  it("should request properties of the new image", async () => {
    // mock shouldn't have been called yet
    assert.lengthOf(require("request-image-size").mock.calls, 0)

    // trigger the event handler with the test event
    await Peppermint.onNewMasterImage(testEvent)

    // assert request-image-size was called with the url
    assert.equal(
      require("request-image-size").mock.calls[0][0],
      testEvent.data.imageUrl
    )
  })

  it("should store image properties with the image in firebase", async () => {
    // Get the event's test post from firebase
    let firebaseUri = `${Config.masterListsRef}/${Config.subreddit}/${testEvent
      .params.postId}`
    let redditPost: RedditPost = (await admin
      .database()
      .ref(firebaseUri)
      .once("value")).val()

    // Assert width and heigth are not (yet) defined
    assert.isUndefined(redditPost.width)
    assert.isUndefined(redditPost.height)

    // Manually fire the event of the post being added
    await Peppermint.onNewMasterImage(testEvent)

    // Get the test post back from firebase
    redditPost = (await admin
      .database()
      .ref(firebaseUri)
      .once("value")).val()

    // Assert width and heigth are now defined
    assert.isNumber(redditPost.width)
    assert.isNumber(redditPost.height)
  })

  it("should add a post to list of interested users", async () => {
    let interestedUser = new User("TEST_TOKEN", 1, 1)
    let uninterestedUser = new User("TEST_TOKEN", 90000, 90000)

    await FirebaseClient.getInstance().addUser(interestedUser)
    await FirebaseClient.getInstance().addUser(uninterestedUser)

    await Peppermint.onNewMasterImage(testEvent)

    let postInUninterestedUsersList = require("firebase-admin")
      .database()
      .ref(
        `${Config.userListRef}/${uninterestedUser.id}/${Config.personalLisRef}/${testEvent
          .params.postId}`
      )
      .getData()

    let postInInterestedUsersList = require("firebase-admin")
      .database()
      .ref(
        `${Config.userListRef}/${interestedUser.id}/${Config.personalLisRef}/${testEvent
          .params.postId}`
      )
      .getData()

    assert.isNull(postInUninterestedUsersList)
    assert.isNotNull(postInInterestedUsersList)
  })
})
