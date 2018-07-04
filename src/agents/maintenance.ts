import { injectable } from "inversify"
import moment from "moment"
import DropboxClient from "../clients/dropbox-client"
import FirebaseClient from "../clients/firebase-client"
import Config from "../objects/config"
import RedditPost from "../objects/reddit-post"
import User from "../objects/user"

@injectable()
export default class Maintenance {
  // Create an array to hold the RedditPosts marked for removal
  private postsToBeRemoved: RedditPost[] = []

  // The user we're running maintenance for
  private user: User

  public async runForUser(userId: string) {
    // Fetch the user, their settings, and their images from Firebase
    this.user = await FirebaseClient.GET_INSTANCE().getUser(userId)

    // Check if the user was last maintained within the interval
    if (!this.shouldMaintain()) return -1
    console.log("Running maintenance...")

    // Remove images that do not meet size requirements
    this.markImagesBySize()

    // Remove images that are older than the max-age
    this.markImagesByAge()

    // Remove marked images from dropbox
    console.log("Deleting images from Dropbox...")
    let pDropbox = this.removeImagesFromDropbox()

    // Push updates to Firebase
    console.log("Updating Firebase...")
    let pFirebase = this.updateFirebase()

    await Promise.all([pDropbox, pFirebase])

    console.log("Maintenance completed.")
  }

  private shouldMaintain(): boolean {
    // Get configuration from Firebase
    const functions = require("firebase-functions")
    const firebaseConfig =
      (global as any).peppermintFirebaseConfig || functions.config()

    // Get the interval in minutes at which a list should be cleaned up
    let maintenanceInterval = parseInt(
      firebaseConfig.peppermint.maintenanceinterval,
      10
    )
    let humanMaintenanceInterval = moment
      .duration(maintenanceInterval, "minutes")
      .humanize()

    // Subtract the interval from the current time
    let maintenanceDeadline = moment()
      .utc()
      .subtract(maintenanceInterval, "minutes")
      .unix()

    console.log("Checking if user dropbox is due maintenance...")
    console.log("Maintenance interval is:", humanMaintenanceInterval)
    let timeSinceLastMaintenance =
      moment()
        .utc()
        .unix() - this.user.lastMaintained
    let humanized = moment
      .duration(timeSinceLastMaintenance * -1, "seconds")
      .humanize(true)
    console.log("Last maintenance was", humanized) // n minutes ago

    // If lastMaintained is LONGER AGO than the deadline, run maintenance
    return this.user.lastMaintained < maintenanceDeadline
  }

  private markImagesBySize() {
    let count = 0
    for (let postId in this.user.images) {
      let post: RedditPost = this.user.images[postId]

      if (
        post.height < this.user.prefMinHeight ||
        post.width < this.user.prefMinWidth
      ) {
        this.postsToBeRemoved.push(post)
        count++
      }
    }
    console.log(
      "Marked",
      count,
      "image(s) for deletion because they don't meet size requirements."
    )
  }

  private markImagesByAge() {
    let count = 0
    const maxAgeInDays = this.user.prefMaxAge
    const deleteBefore = moment()
      .utc()
      .subtract(maxAgeInDays, "days")
      .unix()

    for (let postId in this.user.images) {
      let post: RedditPost = this.user.images[postId]

      if (post.dateAdded < deleteBefore) {
        this.postsToBeRemoved.push(post)
        count++
      }
    }
    console.log(
      "User prefers to delete images older than",
      maxAgeInDays,
      "day(s)"
    )
    console.log("Marked", count, "image(s) older than max age for deletion.")
  }

  private removeImagesFromDropbox() {
    return new Promise(async (resolve, reject) => {
      const dropboxToken = await FirebaseClient.GET_INSTANCE().getUserToken(
        this.user.id
      )
      const dropboxClient = new DropboxClient(dropboxToken)

      dropboxClient
        .deleteImages(this.postsToBeRemoved)
        .then(resolve)
        .catch(reject)
    })
  }

  private updateFirebase() {
    let firebaseUpdates: any = {
      // Last maintained: now
      lastMaintained: moment()
        .utc()
        .unix()
    }

    this.postsToBeRemoved.forEach(post => {
      // https://firebase.google.com/docs/database/admin/save-data#section-update
      // For each post, create a key with the relative path, and set it to null
      // Firebase will then delete these posts, but not others.
      firebaseUpdates[`${Config.personalLisRef}/${post.id}`] = null
    })

    return FirebaseClient.GET_INSTANCE().updateUser(
      this.user.id,
      firebaseUpdates
    )
  }
}
