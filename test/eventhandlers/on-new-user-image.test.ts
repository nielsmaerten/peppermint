import { assert } from "chai"
import { injectable } from "inversify"
import { iocContainer } from "../../src/ioc/inversify.config"
import { TYPES } from "../../src/ioc/types"
import Peppermint from "../../src/peppermint"
import StubCreator from "../helpers/stub-creator"

describe("Peppermint.onNewUserImage", () => {
  let fakeEvent = require("../helpers/new-userimage-event").event

  const mock = jest.fn()
  @injectable()
  class MockMaintenance {
    runForUser = mock
  }

  beforeAll(() => {
    iocContainer.snapshot()
    iocContainer.rebind(TYPES.Maintenance).to(MockMaintenance)
  })

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
    mock.mockReset()
  })

  afterAll(() => {
    iocContainer.restore()
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

  it("should run maintenance for the test user", async () => {
    // Trigger the event handler
    await Peppermint.onNewUserImage(fakeEvent)

    // Check if the mock has been called
    assert.lengthOf(mock.mock.calls, 1)
  })
})
