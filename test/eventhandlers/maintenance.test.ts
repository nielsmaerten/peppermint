import { assert } from "chai"
import * as admin from "firebase-admin"
import Maintenance from "../../src/agents/maintenance"
import { iocContainer } from "../../src/ioc/inversify.config"
import { TYPES } from "../../src/ioc/types"
import Config from "../../src/objects/config"
import StubCreator from "../helpers/stub-creator"

describe("Peppermint.onNewUserImage.maintenance", () => {
  // Import the fake user we'll run our tests on
  // This user already has a list of images, but some need to be pruned...
  let fakeUser = require("../helpers/fake-user").user

  let Maintenance = iocContainer.get<Maintenance>(TYPES.Maintenance)

  beforeEach(async () => {
    // Put the fake user into the fake Firebase
    StubCreator.STUB_FIREBASE()
    await admin
      .database()
      .ref(`${Config.userListRef}/${fakeUser.id}`)
      .set(fakeUser)

    // Stub dropbox API
    jest.mock("dropbox", () => {
      let Dropbox = jest.fn()
      Dropbox.prototype.filesSaveUrl = jest.fn()
      Dropbox.prototype.filesDeleteBatch = jest.fn()
      return Dropbox
    })
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

  xit("should remove an image that's older than max-age", () => {
    fail("Not implemented")
  })

  xit(
    "should remove the oldest image(s) if max-number-of-images is surpassed",
    () => {
      fail("Not implemented")
    }
  )

  it("should remove images no longer in the user's list from their dropbox", async () => {
    // Run maintenance for the test user
    await Maintenance.runForUser(fakeUser.id)

    // The test user has at least 1 image that should be removed

    // Check if dropbox API was called to remove something
    let mockDelete = require("dropbox").prototype.filesDeleteBatch.mock
    assert.isAbove(mockDelete.calls.length, 0)
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

  it("should skip maintenance if the date is in range", async () => {
    // Our testuser was last maintained on 2017-09-24
    // Set the maintenanceInterval very short

    // Run maintenance, it should run
    let result = await Maintenance.runForUser(fakeUser.id)
    assert.notEqual(result, -1, "Maintenance was due, but was skipped")

    // Set a very LONG interval (1000 years)
    ;(global as any).peppermintFirebaseConfig = {}
    ;(global as any).peppermintFirebaseConfig.maintenanceInterval =
      1000 * 365 * 24 * 60

    // Run again, it should be skipped now
    result = await Maintenance.runForUser(fakeUser.id)
    assert.equal(
      result,
      -1,
      "Maintenance wasn't due for another few centuries, it should have been skipped"
    )
  })
})
