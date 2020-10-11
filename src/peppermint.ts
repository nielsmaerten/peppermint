import getPostUrl from "./eventhandlers/get-post-url"
import getWebsiteImage from "./eventhandlers/get-website-image"
import onNewMasterImage from "./eventhandlers/on-new-master-image"
import onNewUserImage from "./eventhandlers/on-new-user-image"
import onSetPreferences from "./eventhandlers/on-set-preferences"
import onTriggerRedditUpdate from "./eventhandlers/on-trigger-reddit-update"
import onUserAuthorized from "./eventhandlers/on-user-authorized"

import * as functions from "firebase-functions"
import { iocContainer } from "./ioc/inversify.config"
import Maintenance from "./agents/maintenance"
import { TYPES } from "./ioc/types"
import admin from "firebase-admin"
;(global as any).peppermintFirebaseConfig = functions.config()

exports.triggerRedditUpdate = functions.https.onRequest((request, response) => {
  console.log("Reddit Update triggered.")
  onTriggerRedditUpdate()
    .then(() => {
      // Firebase CDN will cache the response,
      // so this function will only be executed once every 10 minutes
      response.setHeader("Cache-Control", `public, max-age=${60 * 10}`)
      response.sendStatus(200)
    })
    .catch(error => {
      console.error(error)
      response.sendStatus(500)
    })
})

exports.newMasterImage = functions.database
  .ref("masterlists/r/earthporn/{postId}")
  .onCreate((data, context) => {
    console.log("New master image triggered.")
    return onNewMasterImage(data, context)
  })

exports.newUserImage = functions.database
  .ref("users/{userId}/images/{postId}")
  .onCreate((data, context) => {
    console.log("New user image triggered.")
    return onNewUserImage(data, context)
  })

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

exports.setPreferences = functions.https.onCall((data, context) => {
  console.log("Set user preferences triggered.")
  return onSetPreferences(data, context.auth)
})

exports.websiteImage = functions.https.onRequest(async (request, response) => {
  const imgIndex = request.query.img
  console.log("Requesting website image", imgIndex, "from DB...")

  // Get the URL of the image
  const url = await getWebsiteImage(imgIndex)
  console.log("Redirecting to", url)

  // Cache response for 1 hour
  const maxAge = 60 * 60
  response.setHeader("Cache-Control", "public,max-age=" + maxAge)

  // Use a temporary redirect, cached for 1 hour
  // https://httpstatuses.com/302
  response.redirect(302, url)
})

exports.lookupImageCredits = functions.https.onRequest(
  async (request, response) => {
    const imageId = request.query.id

    // Get the url of the original post
    const postUrl = await getPostUrl(imageId)

    // Return a 404 if not found
    if (postUrl == null) {
      response
        .status(404)
        .send("Peppermint did not find an image with ID: " + imageId)
      return
    }

    // Cache for maximum (1 year)
    const maxAge = 60 * 60 * 24 * 365
    response.setHeader("Cache-Control", "public,max-age=" + maxAge)

    console.log("Redirecting to", postUrl)
    response.redirect(301, postUrl)
  }
)

exports.legacyMaintenance = functions.https.onRequest(async (req, res) => {
  if (admin.apps.length === 0) admin.initializeApp()
  try {
    await admin
      .database()
      .ref("/users")
      .once("value", async sn => {
        const allUsers = sn.val()
        for (const user in allUsers) {
          if (Object.prototype.hasOwnProperty.call(allUsers, user)) {
            const element = allUsers[user]
            console.log("Legacy maintenance starting for", element.id)
            const userId = element.id
            const Maintenance = iocContainer.get<Maintenance>(TYPES.Maintenance)
            await Maintenance.runForUser(userId)
            console.log("Legacy maintenance completed for", element.id)
          }
        }
        res.send("ok")
      })
  } catch (error) {
    console.error(error)
    res.status(500).send("sorry")
  }
})
