import Peppermint from "../../src/peppermint"
import { assert } from "chai"

describe("Peppermint.connectUser", () => {
  beforeEach(() => {
    jest.mock("request-promise", () => {
      return {
        post: jest.fn().mockReturnValue({ access_token: "" })
      }
    })
    jest.mock("firebase-functions", () => {
      return {
        config: () => {
          return {
            dropbox: {
              client_id: "XXX",
              client_secret: "XXX"
            },
            oauth: {
              redirect_after_connect: "https://google.com"
            }
          }
        }
      }
    })
    jest.mock("../../src/clients/firebase-client", () => {
      return {
        getInstance: jest.fn().mockReturnValue({
          addUser: jest.fn()
        })
      }
    })
  })

  it("should exchange an authCode for an access token", async () => {
    let authUrl = await Peppermint.connectUser({
      query: { code: "FAKE_AUTH_CODE" }
    })

    let request = require("request-promise")
    assert.lengthOf(request.post.mock.calls, 1)
  })
})
