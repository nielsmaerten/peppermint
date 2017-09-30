import { expect } from "chai"
import Peppermint from "../src/peppermint"

/**
 * Main Peppermint tests
 */
describe("Peppermint", () => {
  it("should expose an onCheckReddit function", () => {
    expect(Peppermint.onTriggerRedditUpdate).to.be.a("function")
  })

  it("should expose an onNewMasterImage function", () => {
    expect(Peppermint.onNewMasterImage).to.be.a("function")
  })

  it("should expose an onNewUserImage function", () => {
    expect(Peppermint.onNewUserImage).to.be.a("function")
  })

  it("should expose an onUserAuthorized function", () => {
    expect(Peppermint.onUserAuthorized).to.be.a("function")
  })
})
