export default class Peppermint {
  /**
     * Triggered every n minutes.
     * Checks the current list of top-posts on /r/earthporn
     * against an internal master list.
     *
     * If new images exist on Reddit, they are added to the master list
     */
  onCheckReddit() {
    let topPosts = RedditClient.getTopPosts("/r/earthporn")
  }

  /**
     * Triggered when a new image is added to the master list
     * (by the onCheckReddit function)
     *
     * 1. Gets the properties of the image (width, height) and stores them
     * with the image in the list (?)
     *
     * 2. Queries a list of all users who are intersted in an image of this size
     *
     * 3. Adds the image to the personal list of these users
     */
  onNewMasterImage() {
    throw new Error("pending implementation")
  }

  /**
     * Triggered when a new image is added to a user's personal list
     * (by the onNewMasterImage function)
     *
     * 1. Saves the image to the user's dropbox
     *
     * 2. Checks when the user's dropbox was last maintained
     *
     * 3. If the dropbox needs maintenance, removes images that
     * are no longer wanted from the user's list, and dropbox
     */
  onNewUserImage() {
    throw new Error("pending implementation")
  }
}
