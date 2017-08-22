import Peppermint from "../src/peppermint"
import FirebaseClient from "../src/firebase-client"
import { expect, assert } from "chai"

/**
 * Main Peppermint tests
 */
describe("Peppermint", () => {
  let peppermint
  beforeAll(() => {
    peppermint = new Peppermint()
  })

  it("should be initializable", () => {
    expect(peppermint).to.be.instanceOf(Peppermint)
  })

  it("should expose an onCheckReddit function", () => {
    expect(peppermint.onCheckReddit).to.be.a("function")
  })

  it("should expose an onNewMasterImage function", () => {
    expect(peppermint.onNewMasterImage).to.be.a("function")
  })

  it("should expose an onNewUserImage function", () => {
    expect(peppermint.onNewUserImage).to.be.a("function")
  })

  // TODO:
  it("should add items not already in the master list", () => {
    let initialSize = FirebaseClient.getInstance().getMasterList().length
    peppermint.onCheckReddit()
    let newSize = FirebaseClient.getInstance().getMasterList().length
    expect(newSize).to.be.above(initialSize)
  })
})
