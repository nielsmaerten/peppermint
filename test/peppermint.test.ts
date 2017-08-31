import * as Q from "q"
import * as sinon from "sinon"
import { assert, expect } from "chai"
import FirebaseClient from "../src/clients/firebase-client"
import Peppermint from "../src/peppermint"
import RedditClient from "../src/clients/reddit-client"
import RedditPost from "../src/objects/reddit-post"

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

  it("should throw errors for unimplemented functions", () => {
    assert.throws(Peppermint.onNewUserImage)
  })
})
