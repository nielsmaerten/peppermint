import { assert } from "chai"
import Peppermint from "../../src/peppermint"
import StubCreator from "../helpers/stub-creator"

describe("Peppermint.onUserAuthorized", () => {
  beforeEach(() => {
    jest.mock("request", () => {
      return {
        post: jest.fn((options: any, cb: Function) => {
          cb({ access_token: "" })
        })
      }
    })
    StubCreator.STUB_FIREBASE()
  })

  afterEach(StubCreator.RESTORE_FIREBASE)

  it("should exchange an authCode for an access token", async () => {
    await Peppermint.onUserAuthorized({
      query: { code: "FAKE_AUTH_CODE" }
    })

    let request = require("request")
    assert.lengthOf(request.post.mock.calls, 1)
  })
})
