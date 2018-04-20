import { assert, expect } from "chai"
import ImageHelper from "../../src/objects/image-helper"

/**
 * Main Peppermint tests
 */
describe("Image Properties", () => {
  it("should get size of an image", async () => {
    let width = 500
    let height = 120
    let type = "jpg"

    let properties = await ImageHelper.requestImageSize(
      `https://placehold.it/${width}x${height}.${type}`
    )
    expect(properties).to.have.property("height")
    expect(properties).to.have.property("width")
    expect(properties).to.have.property("type")

    expect(properties.width).to.equal(width)
    expect(properties.height).to.equal(height)
    expect(properties.type).to.equal(type)
  })

  it("should correct the url of an image", async () => {
    let fixableUrl = "https://imgur.com/DYPjpkX"
    let unfixableUrl = "https://example.com"

    let fixedUrl = (await ImageHelper.validateAndFixImageUrl(
      fixableUrl
    )) as string
    let failedUrl = await ImageHelper.validateAndFixImageUrl(unfixableUrl)

    assert.isUndefined(failedUrl)
    assert.isDefined(fixedUrl)
    assert.isTrue(fixedUrl.endsWith(".jpg"))
    let properties = await ImageHelper.requestImageSize(fixedUrl)
    expect(properties).to.have.property("height")
    expect(properties).to.have.property("width")
    expect(properties).to.have.property("type")
  })
})
