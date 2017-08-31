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
