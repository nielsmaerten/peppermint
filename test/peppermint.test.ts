import Peppermint from "../src/peppermint"
import FirebaseClient from "../src/firebase-client"
import RedditPost from "../src/reddit-post"
import FirebaseMockCreator from "./firebase-mock-creator"
import { expect, assert } from "chai"
import * as Q from "q"

/**
 * Main Peppermint tests
 */
describe("Peppermint", () => {
  let peppermint
  beforeAll(() => {
    peppermint = new Peppermint()
    FirebaseMockCreator.initMockFirebase()
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
  it("should add items not already in the master list", done => {
    let newPost = new RedditPost("this-is-a-new-post-" + Date.now())
    let postExistsInMasterList = FirebaseClient.getInstance()
      .postExistsInMasterList
    postExistsInMasterList(newPost).then(exists => {
      try {
        assert(
          exists === false,
          "Post expected not to exist was found in database"
        )
        peppermint.onCheckReddit()
        postExistsInMasterList(newPost).then(exists => {
          try {
            assert(exists === true, "Post expected in database was not found")
          } catch (error) {
            fail(error)
          } finally {
            done()
          }
        })
      } catch (error) {
        fail(error)
      }
    })
  })
})
