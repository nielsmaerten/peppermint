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
  let properties = await getImageProperties(event.data.imageUrl)
  await FirebaseClient.getInstance().setPostProperties(
    event.params.postId,
    properties
  )
}
