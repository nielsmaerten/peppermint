import { assert } from "chai"
import { injectable } from "inversify"
import sinon from "sinon"
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
    // Dropbox's filesUpload method should have been called now
    let dropbox = require("dropbox").Dropbox
    let spy = dropbox.stubFilesUpload as sinon.SinonSpy
    spy.lastCall.calledWith(dropbox.stubFilesUpload, {
      path: `/${fakeEvent.data.id}.${fakeEvent.data.type}`,
      mute: true
    })
  })

  it("should run maintenance for the test user", async () => {
    // Trigger the event handler
    await Peppermint.onNewUserImage(fakeEvent)

    // Check if the mock has been called
    assert.lengthOf(mock.mock.calls, 1)
  })
})
