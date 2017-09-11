import { assert, expect } from "chai"
import Peppermint from "../../src/peppermint"
import StubCreator from "../helpers/stub-creator"

describe("Peppermint.onNewUserImage.maintenance", () => {
  beforeEach(StubCreator.stubFirebase)
  afterEach(StubCreator.restoreFirebase)

  it("should check when the dropbox was last maintained", () => {
    // https://github.com/nielsmaerten/peppermint/issues/14
    // trigger with fake event
    // assert dropboxClient.removeFile() was called
    // assert user's list no longer contains the (deprecated) files
    // - Check when the dropbox was last maintained, if > maintenance interval, continue maintenance
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
