import { Dropbox } from "dropbox"
import DeleteArg = DropboxTypes.files.DeleteArg
import RedditPost from "../objects/reddit-post"
require("es6-promise").polyfill()
import "isomorphic-fetch"

export default class DropboxClient {
  private client: Dropbox

  constructor(accessToken: string) {
    this.client = new Dropbox({
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
