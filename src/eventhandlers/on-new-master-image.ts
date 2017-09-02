import getImageProperties from "../objects/image-properties"
import FirebaseClient from "../clients/firebase-client"

/**
 * Triggered when a new image is added to the master list
 * (by the onCheckReddit function)
 *
 * 1. Gets the properties of the image (width, height) and stores them
 * with the image in the list (?)
 *
 * 2. Queries a list of all users who are intersted in an image of this size
 *
 * 3. Adds the image to the personal list of these users
 */
export default async (event: any) => {
  let postId = event.params.postId
  let imageUrl = event.data.val().imageUrl
  console.log(`Getting properties for PostId: ${postId}, ImageUrl: ${imageUrl}`)

  let properties = await getImageProperties(imageUrl)
  console.log(
    `Width: ${properties.width}, Height: ${properties.height}. Updating Firebase...`
  )

  await FirebaseClient.getInstance().setPostProperties(postId, properties)
  console.log("Properties saved in Firebase.")
}
