const functions = require('firebase-functions');
const peppermint = require('peppermint')

global.peppermintFirebaseConfig = functions.config()

exports.triggerRedditUpdate = functions.https.onRequest((request, response) => {
  console.log("Reddit Update triggered.")
  peppermint.onTriggerRedditUpdate()
    .then(() => response.sendStatus(200))
    .catch(error => {
      console.error(error)
      response.sendStatus(500)
    })
})

exports.newMasterImage = functions.database.ref("masterlists/r/earthporn/{postId}").onCreate(event => {
  console.log("New master image triggered.")
  return peppermint.onNewMasterImage(event)
})

exports.newUserImage = functions.database.ref("users/{userId}/images/{postId}").onCreate(event => {
  console.log("New user image triggered.")
  return peppermint.onNewUserImage(event)
})

exports.connectUser = functions.https.onRequest((request, response) => {
  console.log("Connect user triggered.")
  peppermint.connectUser(request)
    .then(url => {
      response.redirect(url)
    })
    .catch(error => {
      console.error(error)
      response.sendStatus(500)
    })
});
