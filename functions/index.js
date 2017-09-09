require('@google-cloud/debug-agent').start({
  allowExpressions: true
});
const functions = require('firebase-functions');
const peppermint = require('peppermint')

global.peppermintFirebaseConfig = functions.config().firebase

exports.triggerRedditUpdate = functions.https.onRequest((request, response) => {
  console.log("Reddit Update triggered.")
  peppermint.onTriggerRedditUpdate()
    .then(() => response.sendStatus(200))
    .catch(error => {
      console.error(error)
      response.sendStatus(500)
    })
});

exports.newMasterImage = functions.database.ref("masterlists/r/earthporn/{postId}").onCreate(event => {
  console.log("New master image triggered.")
  return peppermint.onNewMasterImage(event)
})

exports.newUserImage = functions.database.ref("users/{userId}/images/{postId}").onCreate(event => {
  console.log("New user image triggered.")
  return peppermint.onNewUserImage(event)
})
