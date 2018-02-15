import onNewMasterImage from "./eventhandlers/on-new-master-image"
import onNewUserImage from "./eventhandlers/on-new-user-image"
import onTriggerRedditUpdate from "./eventhandlers/on-trigger-reddit-update"
import onUserAuthorized from "./eventhandlers/on-user-authorized"
import functions from "firebase-functions"

/**
 * Triggers when Peppermint receives an external trigger to check Reddit for new images.
 * Triggering can be done by GET requesting this http endpoint
 */
exports.triggerRedditUpdate = functions.https.onRequest((request, response) => {
  console.log("Reddit Update triggered.")
  onTriggerRedditUpdate()
    .then(() => response.sendStatus(200))
    .catch(error => {
      console.error(error)
      response.sendStatus(500)
    })
})

/**
 * Triggers when a new image has been added to the Master list in Firebase
 */
exports.newMasterImage = functions.database
  .ref("masterlists/r/earthporn/{postId}")
  .onCreate(event => {
    console.log("New master image triggered.")
    return onNewMasterImage(event)
  })

/**
 * Triggers when a new image has been added to the personal list of any user
 */
exports.newUserImage = functions.database
  .ref("users/{userId}/images/{postId}")
  .onCreate(event => {
    console.log("New user image triggered.")
    return onNewUserImage(event)
  })

/**
 * When a user has authorized their Dropbox account, they are redirected to this HTTP endpoint
 * with the access token
 */
exports.onUserAuthorized = functions.https.onRequest((request, response) => {
  console.log("Connect user triggered.")
  onUserAuthorized(request)
    .then(url => {
      response.redirect(url)
    })
    .catch(error => {
      console.error(error)
      response.sendStatus(500)
    })
})
