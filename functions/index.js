require('@google-cloud/debug-agent').start({ allowExpressions: true });
const functions = require('firebase-functions');
const peppermint = require('peppermint')

global.peppermintFirebaseConfig = functions.config().firebase

exports.triggerRedditUpdate = functions.https.onRequest((request, response) => {
  console.log("Reddit Update triggered.")
  processPromise(peppermint.onTriggerRedditUpdate(), response)
});

exports.newMasterImage = functions.database.ref("masterlists/r/earthporn/{postId}").onCreate(event => {
  console.log("New master image triggered.")
  console.log(JSON.stringify(event.params))
  processPromise(peppermint.onNewMasterImage(event), response)
})

processPromise = (promise, response) => {
  promise
    .then(() => response.sendStatus(200))
    .catch(error => {
      console.error(error)
      response.sendStatus(500)
    })
}
