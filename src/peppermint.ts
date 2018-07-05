import onNewMasterImage from "./eventhandlers/on-new-master-image"
import onNewUserImage from "./eventhandlers/on-new-user-image"
import onTriggerRedditUpdate from "./eventhandlers/on-trigger-reddit-update"
import onUserAuthorized from "./eventhandlers/on-user-authorized"
import getRandomImageUrl from "./eventhandlers/random-image"

export default class Peppermint {
  static onTriggerRedditUpdate = onTriggerRedditUpdate
  static onNewMasterImage = onNewMasterImage
  static onNewUserImage = onNewUserImage
  static onUserAuthorized = onUserAuthorized
  static getRandomImageUrl = getRandomImageUrl
}
