import { injectable } from "inversify"
import moment from "moment"
import FirebaseClient from "../clients/firebase-client"

@injectable()
export default class Maintenance {
  public async runForUser(userId: number) {
    const functions = require("firebase-functions")
    const firebaseConfig =
      (global as any).peppermintFirebaseConfig || functions.config()

    // Get the interval in minutes at which a list should be cleaned up
    let maintenanceInterval = firebaseConfig.maintenanceInterval

    // Subtract the interval from the current time
    let maintenanceDeadline = moment()
      .utc()
      .subtract(maintenanceInterval, "minutes")
      .unix()

    // Fetch the user, their settings, and their images from Firebase
    let user = await FirebaseClient.GET_INSTANCE().getUser(userId)

    // Compare timestamps to see if deadline has passed
    if (user.lastMaintained > maintenanceDeadline) {
      // No maintenance necessary at this point: exit function
      return
    }

    // TODO: The actual maintenance...

    // Update the lastMaintained date to now
    await FirebaseClient.GET_INSTANCE().updateUser(userId, {
      lastMaintained: moment().unix()
    })
  }
}
