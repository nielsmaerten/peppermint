import Dropbox from "dropbox"

export default class DropboxClient {
  private dropbox: Dropbox

  constructor(private accessToken: string) {
    this.dropbox = new Dropbox({
      accessToken: accessToken
    })
  }

  public uploadImage(imageUrl: string, filename: string) {
    return this.dropbox.filesSaveUrl({
      path: `/${filename}`,
      url: imageUrl
    })
  }
}
