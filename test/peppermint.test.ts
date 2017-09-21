import { assert, expect } from "chai"
import * as Q from "q"
import * as sinon from "sinon"
import FirebaseClient from "../src/clients/firebase-client"
import RedditClient from "../src/clients/reddit-client"
import RedditPost from "../src/objects/reddit-post"
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

  it("should expose a connectUser function", () => {
    expect(Peppermint.connectUser).to.be.a("function")
  })
})
