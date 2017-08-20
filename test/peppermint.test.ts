import Peppermint from "../src/peppermint"
import { expect, assert } from "chai"

/**
 * Main Peppermint tests
 */
describe("Peppermint", () => {
  xit("should have a newImageAdded Function", () => {
    expect(new Peppermint().newImageAdded).to.be.a("function")
  })

  xit("should have a function to add an Image to a Dropbox", () => {
    let peppermint = new Peppermint()
    expect(peppermint.addImageToDropbox).to.be.a("function")
  })
})
