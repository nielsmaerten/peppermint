import moment from "moment"
import FirebaseClient from "../clients/firebase-client"

export default class Maintenance {
  public static async RUN_FOR_USER(userId: number) {
    await FirebaseClient.GET_INSTANCE().updateUser(userId, {
      lastMaintained: moment().unix()
    })
  }
}
