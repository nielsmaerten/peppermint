export default function getImageProperties(imageUrl: string) {
  const requestImageSize = require("request-image-size")
  return requestImageSize(imageUrl)
}
