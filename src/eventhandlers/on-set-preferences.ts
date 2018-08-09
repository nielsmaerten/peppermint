import FirebaseClient from "../clients/firebase-client"

/**
 * Called by the user from the webpage, with updated settings
 */
export default async (data: any, auth: any) => {
  let firebase = FirebaseClient.GET_INSTANCE()

  try {
    const prefMinWidth = parseInt(data.minWidth, 2)
    const prefMinHeight = parseInt(data.minHeight, 2)
    const prefMaxAge = parseInt(data.deleteAfterDays, 2)

    return firebase.updateUser(auth.uid, {
      prefMinWidth,
      prefMinHeight,
      prefMaxAge
    })
  } catch (error) {
    throw new Error("Error updating settings: " + error)
  }
}
