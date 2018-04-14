import { assert, expect } from "chai"
import { Dropbox } from "dropbox"
import sinon from "sinon"
import DropboxClient from "../../src/clients/dropbox-client"

describe("DropboxClient", () => {
  let client: DropboxClient

  beforeAll(() => {
    client = new DropboxClient("TOKEN")
  })

  it("should initialize a Dropbox client", () => {
    expect(client).to.be.instanceOf(DropboxClient)
  })

  it("should have an uploadImage function", () => {
    expect(client.uploadImage).to.be.a("function")
  })

  it("should upload an image to my dropbox", async () => {
    let imageUrl = "https://placehold.it/500x500.jpg?text=Hello%20World!"
    let filename = "testfile.jpg"
    await client.uploadImage({
      id: "testfile",
      imageUrl: "https://placehold.it/500x500.jpg?text=Hello%20World!",
      type: "jpg",
      dateAdded: 1,
      width: 500,
      height: 500
    })

    // Reach into DropboxClient for the actual Dropbox instance,
    // and get our spy for method filesSaveUrl:
    let spy = client["client"].filesSaveUrl as sinon.SinonSpy

    // Verify it was just called with the parameters above
    spy.lastCall.calledWith({
      path: "/testfile.jpg",
      url: "http://placehold.it/500x500.jpg?text=Hello%20World!"
    })
  })
})
