const functions = require('firebase-functions');
const peppermint = require('peppermint')

exports.triggerRedditUpdate = functions.https.onRequest((request, response) => {
  return peppermint.onTriggerRedditUpdate()
});
