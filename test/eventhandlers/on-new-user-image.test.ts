import { assert, expect } from "chai"
import Peppermint from "../../src/peppermint"
import RedditPost from "../../src/objects/reddit-post"
import StubCreator from "../helpers/stub-creator"
import * as admin from "firebase-admin"
import Config from "../../src/objects/config"
import User from "../../src/objects/user"
import FirebaseClient from "../../src/clients/firebase-client"

describe("Peppermint.onNewUserImage", () => {
  beforeEach(async () => {
    //
  })

  afterEach(() => {
    //
  })

  it("should save a newly added image to Dropbox", async () => {
    // https://github.com/nielsmaerten/peppermint/issues/13
    // spy on: DropboxClient.saveFile() (or mock?)
    // trigger with a fake event
    // assert DropboxClient.saveFile() was called with userId(?) and imageUrl(?)
  })

  it("should remove old files from Dropbox", () => {
    // https://github.com/nielsmaerten/peppermint/issues/14
    // mock: dropboxClient.removeFile()
    // fill user's list with some fake entries
    // trigger with fake event
    // assert dropboxClient.removeFile() was called
    // assert user's list no longer contains the (deprecated) files
  })
})
