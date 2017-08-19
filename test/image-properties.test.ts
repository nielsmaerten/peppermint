import getImageProperties from "../src/image-properties"
import { expect } from "chai"

/**
 * Main Peppermint tests
 */
describe("Image Properties", () => {
  it("should get size of an image", done => {
    getImageProperties("http://placehold.it/500.jpg")
      .then(properties => {
        expect(properties).to.have.property("height")
        expect(properties).to.have.property("width")
        expect(properties).to.have.property("type")
        done()
      })
      .catch(fail)
  })
})
