import Dropbox from "dropbox"
import RedditPost from "../objects/reddit-post"
import DeleteArg = DropboxTypes.files.DeleteArg

export default class DropboxClient {
  private dropbox = require("dropbox")
  private client: Dropbox

  constructor(accessToken: string) {
    this.client = new this.dropbox({
      accessToken: accessToken
    })
  }

  public uploadImage(image: RedditPost) {
    return this.client.filesSaveUrl({
      path: this.getFilename(image),
      url: image.imageUrl
    })
  }

  public deleteImages(images: RedditPost[]) {
    let entries: DeleteArg[] = []
    images.map(image => entries.push({ path: this.getFilename(image) }))
    return this.client.filesDeleteBatch({
      entries: entries
    })
  }

  private getFilename(image: RedditPost) {
    return `/${image.id}.${image.type}`
  }
}
