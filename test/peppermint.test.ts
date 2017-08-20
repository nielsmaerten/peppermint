import Peppermint from "../src/peppermint"
import { expect, assert } from "chai"

/**
 * Main Peppermint tests
 */
describe("Peppermint", () => {
  it("should be initializable", () => {
    expect(new Peppermint()).to.be.instanceOf(Peppermint)
  })
})
