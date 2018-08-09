import FirebaseClient from "../clients/firebase-client"
import { isNumber } from "util"

/**
 * Called by the user from the webpage, with updated settings
 */
export default async (data: any, auth: any) => {
  let firebase = FirebaseClient.GET_INSTANCE()

  try {
    const prefMinWidth = parseInt(data.minWidth)
    const prefMinHeight = parseInt(data.minHeight)
    const prefMaxAge = parseInt(data.deleteAfterDays)

    return firebase.updateUser(auth.uid, {
      prefMinWidth,
      prefMinHeight,
      prefMaxAge
    })
  } catch (error) {
    throw new Error("Error updating settings: " + error)
  }
}
