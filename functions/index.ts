import * as functions from 'firebase-functions'
import Peppermint from 'peppermint'

(global as any).peppermintFirebaseConfig = functions.config()

exports.triggerRedditUpdate = functions.https.onRequest((request, response) => {
  console.log("Reddit Update triggered.")
  Peppermint.onTriggerRedditUpdate()
    .then(() => response.sendStatus(200))
    .catch(error => {
      console.error(error)
      response.sendStatus(500)
    })
})

exports.newMasterImage = functions.database.ref("masterlists/r/earthporn/{postId}").onCreate(event => {
  console.log("New master image triggered.")
  return Peppermint.onNewMasterImage(event)
})

exports.newUserImage = functions.database.ref("users/{userId}/images/{postId}").onCreate(event => {
  console.log("New user image triggered.")
  return Peppermint.onNewUserImage(event)
})

exports.onUserAuthorized = functions.https.onRequest((request, response) => {
  console.log("Connect user triggered.")
  Peppermint.onUserAuthorized(request)
    .then(url => {
      response.redirect(url)
    })
    .catch(error => {
      console.error(error)
      response.sendStatus(500)
    })
});
