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
    let args = {
      path: `/${filename}`,
      url: imageUrl
    }
    console.log(
      "Calling dropbox(",
      this.accessToken,
      ").filesSaveUrl with",
      JSON.stringify(args)
    )
    return this.client.filesSaveUrl(args)
  }
}
