import * as sinon from "sinon"
import { assert, expect } from "chai"
import Dropbox from "dropbox"
import DropboxClient from "../../src/clients/dropbox-client"

describe("DropboxClient", () => {
  let client: DropboxClient
  let fileSaveUrlStub: any

  beforeAll(() => {
    fileSaveUrlStub = sinon.stub(Dropbox.prototype, "filesSaveUrl").resolves()
    client = new DropboxClient("TOKEN")
  })

  it("should initialize a Dropbox client", () => {
    expect(client).to.be.instanceOf(DropboxClient)
  })

  it("should have an uploadImage function", () => {
    expect(client.uploadImage).to.be.a("function")
  })

  it("should upload an image to my dropbox", async () => {
    let imageUrl = "http://placehold.it/500x500.jpg?text=Hello%20World!"
    let filename = "testfile.jpg"
    await client.uploadImage(imageUrl, filename)
    assert.isTrue(fileSaveUrlStub.called)
  })
})