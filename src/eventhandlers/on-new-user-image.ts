import FirebaseClient from "../clients/firebase-client"
import DropboxClient from "../clients/dropbox-client"
/**
 * Triggered when a new image is added to a user's personal list
 * (by the onNewMasterImage function)
 *
 * 1. Saves the image to the user's dropbox
 *
 * 2. Checks when the user's dropbox was last maintained
 *
 * 3. If the dropbox needs maintenance, removes images that
 * are no longer wanted from the user's list, and dropbox
 */
export default async (event: any) => {
  let token = await FirebaseClient.getInstance().getUserToken(
    event.params.userId
  )
  let dropbox = new DropboxClient(token)

  return dropbox.uploadImage(
    event.data.imageUrl,
    `${event.params.postId}.${event.data.type}`
  )
}
