import Dropbox from "dropbox"

export default class DropboxClient {
  private dropbox = require("dropbox")
  private client: Dropbox

  constructor(private accessToken: string) {
    this.client = new this.dropbox({
      accessToken: accessToken
    })
  }

  public uploadImage(imageUrl: string, filename: string) {
    return this.client.filesSaveUrl({
      path: `/${filename}`,
      url: imageUrl
    })
  }
}
