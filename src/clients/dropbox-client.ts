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
      const chunks: Buffer[] = []
      this.getHttpOrHttps(
        image.imageUrl
      ).get(image.imageUrl, (response: IncomingMessage) => {
        response
          .on("data", (chunk: Buffer) => chunks.push(chunk))
          .on("end", () => {
            const contents = Buffer.concat(chunks)
            if (contents.byteLength === 0) {
              console.error(
                `Attempted to download image ${image.imageUrl}, but got 0 bytes.`
              )
            } else {
              this.client
                .filesUpload({
                  mute: true,
                  path: this.getFilename(image),
                  contents
                })
                .then(resolve)
                .catch(reject)
            }
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
