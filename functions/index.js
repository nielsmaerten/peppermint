const functions = require('firebase-functions');
const admin = require('firebase-admin')
const peppermint = require('peppermint')

exports.triggerRedditUpdate = functions.https.onRequest((request, response) => {
  if (admin.apps.length === 0) {
    admin.initializeApp(functions.config().firebase)
  }
  return peppermint.onTriggerRedditUpdate()
});
