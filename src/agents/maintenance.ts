import { injectable } from "inversify"
import moment from "moment"
import DropboxClient from "../clients/dropbox-client"
import FirebaseClient from "../clients/firebase-client"
import RedditPost from "../objects/reddit-post"
import User from "../objects/user"

@injectable()
export default class Maintenance {
  // Create an update object to hold images to be removed
  private firebaseUpdates: any = {}

  // Create an array to hold the RedditPosts marked for removal
  private postsToBeRemoved: RedditPost[] = []

  // The user we're running maintenance for
  private user: User

  public async runForUser(userId: string) {
    // Fetch the user, their settings, and their images from Firebase
    this.user = await FirebaseClient.GET_INSTANCE().getUser(userId)

    // Check if the user was last maintained within the interval
    if (!this.shouldMaintain()) return -1

    // Remove images that do not meet size requirements
    this.markImagesBySize()

    // Remove marked images from dropbox
    await this.removeImagesFromDropbox()

    // Push updates to Firebase
    await this.updateFirebase()
  }

  private shouldMaintain(): boolean {
    // Get configuration from Firebase
    const functions = require("firebase-functions")
    const firebaseConfig =
      (global as any).peppermintFirebaseConfig || functions.config()

    // Get the interval in minutes at which a list should be cleaned up
    let maintenanceInterval = firebaseConfig.maintenanceInterval

    // Subtract the interval from the current time
    let maintenanceDeadline = moment()
      .utc()
      .subtract(maintenanceInterval, "minutes")
      .unix()

    // If lastMaintained is LONGER AGO than the deadline, run maintenance
    return this.user.lastMaintained < maintenanceDeadline
  }

  private markImagesBySize() {
    for (let postId in this.user.images) {
      let post: RedditPost = this.user.images[postId]

      if (
        post.height < this.user.prefMinHeight ||
        post.width < this.user.prefMinWidth
      ) {
        this.firebaseUpdates[post.id] = null
        this.postsToBeRemoved.push(post)
      }
    }
  }

  private async removeImagesFromDropbox() {
    const dropboxToken = await FirebaseClient.GET_INSTANCE().getUserToken(
      this.user
    )
    const dropboxClient = new DropboxClient(dropboxToken)

    return dropboxClient.deleteImages(this.postsToBeRemoved)
  }

  private async updateFirebase() {
    await FirebaseClient.GET_INSTANCE().updateUser(this.user.id, {
      // Last maintained: now
      lastMaintained: moment()
        .utc()
        .unix(),

      // PostIDs set to null will be removed by Firebase
      images: this.firebaseUpdates
    })
  }
}
