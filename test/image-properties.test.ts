import getImageProperties from "../src/image-properties"
import { expect } from "chai"

/**
 * Main Peppermint tests
 */
describe("Image Properties", () => {
  it("should get size of an image", done => {
    let width = 500
    let height = 120
    let type = "jpg"

    getImageProperties(`http://placehold.it/${width}x${height}.${type}`)
      .then(properties => {
        expect(properties).to.have.property("height")
        expect(properties).to.have.property("width")
        expect(properties).to.have.property("type")

        expect(properties.width).to.equal(width)
        expect(properties.height).to.equal(height)
        expect(properties.type).to.equal(type)
        done()
      })
      .catch(fail)
  })
})
