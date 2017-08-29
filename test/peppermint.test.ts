import Peppermint from "../src/peppermint"
import FirebaseClient from "../src/firebase-client"
import RedditPost from "../src/reddit-post"
import RedditClient from "../src/reddit-client"
import { expect, assert } from "chai"
import * as sinon from "sinon"
import * as Q from "q"

/**
 * Main Peppermint tests
 */
describe("Peppermint", () => {
  it("should expose an onCheckReddit function", () => {
    expect(Peppermint.onCheckReddit).to.be.a("function")
  })

  it("should expose an onNewMasterImage function", () => {
    expect(Peppermint.onNewMasterImage).to.be.a("function")
  })

  it("should expose an onNewUserImage function", () => {
    expect(Peppermint.onNewUserImage).to.be.a("function")
  })
})
