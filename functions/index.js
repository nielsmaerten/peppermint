const functions = require('firebase-functions');
const peppermint = require('peppermint')

exports.triggerRedditUpdate = functions.https.onRequest((request, response) => {
  global.peppermintFirebaseConfig = functions.config().firebase
  peppermint.onTriggerRedditUpdate()
    .then(() => response.sendStatus(200))
    .catch(error => {
      console.error(error)
      response.sendStatus(500)
    })
});
