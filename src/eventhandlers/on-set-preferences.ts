import FirebaseClient from "../clients/firebase-client"

/**
 * Called by the user from the webpage, with updated settings
 */
export default async (data: any, auth: any) => {
  let firebase = FirebaseClient.GET_INSTANCE()
  console.log("Updating settings for user", auth.uid)
  console.log("Settings payload:", data)

  try {
    const prefMinWidth = parseInt(data.prefMinWidth, 2)
    const prefMinHeight = parseInt(data.prefMinHeight, 2)
    const prefMaxAge = parseInt(data.prefMaxAge, 2)

    const update = {
      prefMinHeight,
      prefMinWidth,
      prefMaxAge
    }

    console.log("Submitting update to Firebase", update)

    return firebase.updateUser(auth.uid, update)
  } catch (error) {
    throw new Error("Error updating settings: " + error)
  }
}
