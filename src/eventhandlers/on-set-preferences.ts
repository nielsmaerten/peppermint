import FirebaseClient from "../clients/firebase-client"

/**
 * Called by the user from the webpage, with updated settings
 */
export default async (data: any, auth: any) => {
  let firebase = FirebaseClient.GET_INSTANCE()
  console.log("Updating settings for user", auth.uid)
  console.log("Settings payload:", data)

  try {
    const update = {
      prefMinHeight: +data.prefMinHeight || 1080,
      prefMinWidth: +data.prefMinWidth || 1920,
      prefMaxAge: +data.prefMaxAge || 30,
      prefOrientation: +data.prefOrientation || 0
    }

    console.log("Submitting update to Firebase", update)

    return firebase.updateUser(auth.uid, update)
  } catch (error) {
    throw new Error("Error updating settings: " + error)
  }
}
