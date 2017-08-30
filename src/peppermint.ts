import onTriggerRedditUpdate from "./eventhandlers/on-trigger-reddit-update"
import onNewMasterImage from "./eventhandlers/on-new-master-image"
import onNewUserImage from "./eventhandlers/on-new-user-image"

export default class Peppermint {
  static onTriggerRedditUpdate = onTriggerRedditUpdate
  static onNewMasterImage = onNewMasterImage
  static onNewUserImage = onNewUserImage
}
