import { assert, expect } from "chai"
import Peppermint from "../../src/peppermint"
import StubCreator from "../helpers/stub-creator"

describe("Peppermint.onNewMasterImage", () => {
  it("should get the properties of the new image", async () => {
    // Setup mock request-image-size and example event
    jest.mock("request-image-size")
    let event = require("../helpers/new-masterimage-event").event

    // trigger the event handler
    await Peppermint.onNewMasterImage(event)

    // assert request-image-size was called
    assert.equal(
      require("request-image-size").mock.calls[0] /*function-arguments*/[0],
      event.data.imageUrl,
      "Expected 'image-request size' to have been called with test url"
    )
  })
})
