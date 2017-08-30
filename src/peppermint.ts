import onCheckReddit from "./eventhandlers/on-reddit-check"
import onNewMasterImage from "./eventhandlers/on-new-master-image"
import onNewUserImage from "./eventhandlers/on-new-user-image"

export default class Peppermint {
  static onCheckReddit = onCheckReddit
  static onNewMasterImage = onNewMasterImage
  static onNewUserImage = onNewUserImage
}
