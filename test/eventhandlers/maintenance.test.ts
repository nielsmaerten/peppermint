import { assert, expect } from "chai"
import Peppermint from "../../src/peppermint"
import StubCreator from "../helpers/stub-creator"
import * as admin from "firebase-admin"
import Config from "../../src/objects/config"
import User from "../../src/objects/user"
import RedditPost from "../../src/objects/reddit-post"

describe("Peppermint.onNewUserImage.maintenance", () => {
  let fakeUser = require("../helpers/fake-user").user
  let fakeEvent = require("../helpers/new-userimage-event").event
  fakeEvent.data.val = () => fakeEvent.data

  beforeAll(() => {
    jest.mock("dropbox", () => {
      let Dropbox = jest.fn()
      Dropbox.prototype.filesSaveUrl = jest.fn()
      return Dropbox
    })
  })

  beforeEach(StubCreator.stubFirebase)
  afterEach(StubCreator.restoreFirebase)

  it("should remove some posts from user's list", async () => {
    let fakeUserRef = admin
      .database()
      .ref(`${Config.userListRef}/${fakeUser.id}`)

    await fakeUserRef.set(fakeUser)
    await fakeUserRef.update({
      // Way in the past :)
      lastMaintained: new Date().setFullYear(2000).toString()
    })

    let getNrOfPosts = () =>
      Object.keys((fakeUserRef as any).getData().images).length
    let originalNrOfPosts = getNrOfPosts()

    // trigger with fake event
    await Peppermint.onNewUserImage(fakeEvent)

    assert.isBelow(getNrOfPosts(), originalNrOfPosts)
  })

  it("should remove images that don't meet user's requirements from their list", () => {
    // - Remove all images that no longer meet the user's requirements* from the user's list
    // (*) Requirements can include: width, heigth, max-age, max-number-of-files (optional),...
  })

  it("should remove images no longer in the user's list from their dropbox", () => {
    // - Remove all images that are no longer in the user's list from their dropbox
  })

  it("should update the last-maintained date", () => {
    //  - Update date last maintained
  })
})
