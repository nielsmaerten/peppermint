import { assert } from "chai"
import Peppermint from "../../src/peppermint"
import StubCreator from "../helpers/stub-creator"

describe("Peppermint.connectUser", () => {
  beforeEach(() => {
    jest.mock("request-promise", () => {
      return {
        post: jest.fn().mockReturnValue({ access_token: "" })
      }
    })
    StubCreator.stubFirebase()
  })

  afterEach(StubCreator.restoreFirebase)

  it("should exchange an authCode for an access token", async () => {
    let authUrl = await Peppermint.connectUser({
      query: { code: "FAKE_AUTH_CODE" }
    })

    let request = require("request-promise")
    assert.lengthOf(request.post.mock.calls, 1)
  })
})
