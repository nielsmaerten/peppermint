import Maintenance from "../agents/maintenance"
import DropboxClient from "../clients/dropbox-client"
import FirebaseClient from "../clients/firebase-client"
import { iocContainer } from "../ioc/inversify.config"
import { TYPES } from "../ioc/types"

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
  console.log(`Getting token for user ${event.params.userId}...`)
  let token = await FirebaseClient.GET_INSTANCE().getUserToken(event.params
    .userId as string)
  let dropbox = new DropboxClient(token)

  console.log(`Uploading post ${event.params.postId} to user's dropbox...`)
  try {
    await dropbox.uploadImage(event.data.val())
  } catch (error) {
    // WTF dropbox... Could you nest this any deeper??
    if (
      error.error &&
      error.error.error &&
      error.error.error[".tag"] === "invalid_access_token"
    ) {
      console.warn(
        "User",
        event.params.userId,
        "seems to have disconnected Peppermint from their Dropbox. Removing their account"
      )
      await FirebaseClient.GET_INSTANCE().deleteUser(event.params.userId)
      return
    } else {
      console.error(
        "Failed to upload post",
        event.params.postId,
        "to Dropbox of user",
        event.params.userId
      )
      throw error
    }
  }

  const Maintenance = iocContainer.get<Maintenance>(TYPES.Maintenance)
  await Maintenance.runForUser(event.params.userId)
}
