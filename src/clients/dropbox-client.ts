import { Dropbox } from "dropbox"
import DeleteArg = DropboxTypes.files.DeleteArg
import RedditPost from "../objects/reddit-post"
require("es6-promise").polyfill()
import { IncomingMessage } from "http"
import "isomorphic-fetch"

export default class DropboxClient {
  private client: Dropbox

  constructor(accessToken: string) {
    this.client = new Dropbox({
      accessToken: accessToken
    })
  }

  public uploadImage(image: RedditPost) {
    return new Promise((resolve, reject) => {
      const imageContents = Buffer.alloc(0)
      this.getHttpOrHttps(
        image.imageUrl
      ).get(image.imageUrl, (response: IncomingMessage) => {
        response
          .on("data", (chunk: Buffer) => chunk.copy(imageContents))
          .on("end", () => {
            this.client
              .filesUpload({
                mute: true,
                path: this.getFilename(image),
                contents: imageContents
              })
              .then(resolve)
              .catch(reject)
          })
      })
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

  private getHttpOrHttps(url: string) {
    const adapters: any = {
      "http:": require("http"),
      "https:": require("https")
    }

    const protocol = require("url").parse(url).protocol
    return adapters[protocol]
  }
}
