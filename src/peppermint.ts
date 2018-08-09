import onNewMasterImage from "./eventhandlers/on-new-master-image"
import onNewUserImage from "./eventhandlers/on-new-user-image"
import onSetPreferences from "./eventhandlers/on-set-preferences"
import onTriggerRedditUpdate from "./eventhandlers/on-trigger-reddit-update"
import onUserAuthorized from "./eventhandlers/on-user-authorized"

export default class Peppermint {
  static onTriggerRedditUpdate = onTriggerRedditUpdate
  static onNewMasterImage = onNewMasterImage
  static onNewUserImage = onNewUserImage
  static onUserAuthorized = onUserAuthorized
  static onSetPreferences = onSetPreferences
}
