import connectUser from "./eventhandlers/connect-user"
import onNewMasterImage from "./eventhandlers/on-new-master-image"
import onNewUserImage from "./eventhandlers/on-new-user-image"
import onTriggerRedditUpdate from "./eventhandlers/on-trigger-reddit-update"

export default class Peppermint {
  static onTriggerRedditUpdate = onTriggerRedditUpdate
  static onNewMasterImage = onNewMasterImage
  static onNewUserImage = onNewUserImage
  static connectUser = connectUser
}
