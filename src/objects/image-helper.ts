import request from "request"
export default class ImageHelper {
  static requestImageSize = (imageUrl: string) => {
    const requestImageSize = require("request-image-size")
    return requestImageSize(imageUrl)
  }

  static validateAndFixImageUrl = async (imageUrl: string) => {
    const fileType = require("file-type")

    const isImageUrl = (imageUrl: string) =>
      new Promise(resolve => {
        request
          .get(imageUrl)
          .on("response", resp => {
            resp.once("data", chunk => {
              resp.destroy()
              const type = fileType(chunk)
              resolve(type && type.mime && type.mime.startsWith("image/"))
            })
          })
          .on("error", () => resolve(false))
      })

    return new Promise(async resolve => {
      // Undefined is the default. If it's not overridden, no valid url was found
      let result = undefined

      // The url is valid on it's own, just return it as-is
      if (await isImageUrl(imageUrl)) {
        result = imageUrl
      } else {
        // The url is not valid, try appending known extensions:
        const possibleExtensions = [".jpg", ".jpeg", ".png"]
        for (let i = 0; i < possibleExtensions.length; i++) {
          const testUrl = imageUrl + possibleExtensions[i]
          if (await isImageUrl(testUrl)) {
            result = testUrl
            break
          }
        }
      }

      resolve(result)
    })
  }
}
