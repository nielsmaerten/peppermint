import { assert } from "chai"
import * as admin from "firebase-admin"
import { iocContainer } from "../../src/ioc/inversify.config"
import { TYPES } from "../../src/ioc/types"
import Config from "../../src/objects/config"
import StubCreator from "../helpers/stub-creator"

describe("Peppermint.onNewUserImage.maintenance", () => {
  // Import the fake user we'll run our tests on
  // This user already has a list of images, but some need to be pruned...
  let fakeUser = require("../helpers/fake-user").user

  let Maintenance = iocContainer.get(TYPES.Maintenance)

  beforeAll(() => {
    // Stub Dropbox.filesSaveUrl
    jest.mock("dropbox", () => {
      let Dropbox = jest.fn()
      Dropbox.prototype.filesSaveUrl = jest.fn()
      return Dropbox
    })
  })

  beforeEach(() => {
    // Put the fake user into the fake Firebase
    StubCreator.STUB_FIREBASE()
    admin
      .database()
      .ref(`${Config.userListRef}/${fakeUser.id}`)
      .set(fakeUser)
  })
  afterEach(StubCreator.RESTORE_FIREBASE)

  it("should remove some posts from user's list", async () => {
    // Check how many images the testUser currently has in their list
    let fakeUserRef = admin
      .database()
      .ref(Config.userListRef + "/" + fakeUser.id)
    let getNrOfPosts = () =>
      Object.keys((fakeUserRef as any).getData().images).length
    let originalNrOfPosts = getNrOfPosts()

    // Run maintenance on the testUser
    await Maintenance.runForUser(fakeUser.id)

    // Some images should have been removed from their list now
    assert.isBelow(getNrOfPosts(), originalNrOfPosts)
  })

  it("should remove an image that doesn't meet size requirements", async () => {
    let userId = fakeUser.id
    let deprecatedPost = fakeUser.images["too-small"]

    await Maintenance.runForUser(fakeUser.id)

    assert.isNull(
      require("firebase-admin")
        .database()
        .ref(`${Config.userListRef}/${userId}/images/${deprecatedPost.id}`)
        .getData()
    )
  })

  it("should remove an image that's older than max-age", () => {
    fail("Not implemented")
  })

  it("should remove the oldest image(s) if max-number-of-images is surpassed", () => {
    fail("Not implemented")
  })

  it("should remove images no longer in the user's list from their dropbox", () => {
    // - Remove all images that are no longer in the user's list from their dropbox
    fail("Not implemented")
  })

  it("should update the last-maintained date", async () => {
    const userRef = require("firebase-admin")
      .database()
      .ref(`${Config.userListRef}/${fakeUser.id}`)

    const lastMaintained = userRef.getData().lastMaintained
    await Maintenance.runForUser(fakeUser.id)
    const newLastMaintained = userRef.getData().lastMaintained

    assert.isAbove(newLastMaintained, lastMaintained)
  })
})
