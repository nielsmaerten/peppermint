import { injectable } from "inversify"
import moment from "moment"
import FirebaseClient from "../clients/firebase-client"

@injectable()
export default class Maintenance {
  public async runForUser(userId: number) {
    await FirebaseClient.GET_INSTANCE().updateUser(userId, {
      lastMaintained: moment().unix()
    })
  }
}
