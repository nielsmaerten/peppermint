import { assert } from "chai"
import Peppermint from "../../src/peppermint"
import StubCreator from "../helpers/stub-creator"

describe("Peppermint.onNewUserImage", () => {
  let fakeEvent = require("../helpers/new-userimage-event").event

  beforeEach(async () => {
    StubCreator.STUB_FIREBASE()

    jest.mock("dropbox", () => {
      let Dropbox = jest.fn()
      Dropbox.prototype.filesSaveUrl = jest.fn()
      return Dropbox
    })

    // data is actually a Firebase DeltaSnapshot,
    // so let's fake it's 'val()' function:
    fakeEvent.data.val = () => fakeEvent.data
  })

  afterEach(() => {
    StubCreator.RESTORE_FIREBASE()
  })

  it("should save a newly added image to Dropbox", async () => {
    await Peppermint.onNewUserImage(fakeEvent)

    // Dropbox's filesSaveUrl should have been called now
    let dropbox = require("dropbox")
    assert.deepEqual(dropbox.prototype.filesSaveUrl.mock.calls[0][0], {
      path: `/${fakeEvent.data.id}.${fakeEvent.data.type}`,
      url: fakeEvent.data.imageUrl
    })
  })

  it("should run maintenance for the user", async () => {
    const maintenance = require("../agents/maintenance")
    await Peppermint.onNewUserImage(fakeEvent)
    assert.lengthOf(maintenance.prototype.RUN_FOR_USER.mock.calls, 1)
  })
})
