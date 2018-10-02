import moment from "moment"
import FirebaseClient from "../clients/firebase-client"
import ImageHelper from "../objects/image-helper"
import RedditPost from "../objects/reddit-post"

/**
 * Triggered when a new image is added to the master list
 * (by the onCheckReddit function)
 *
 * 1. Gets the properties of the image (width, height) and stores them
 * with the image in the list (?)
 *
 * 2. Queries a list of all users who are interested in an image of this size
 *
 * 3. Adds the image to the personal list of these users
 */
export default async (data: any, context: any) => {
  let postId = context.params.postId
  let imageUrl = data.val().imageUrl
  let postUrl = data.val().postUrl
  console.log(`Getting properties for PostId: ${postId}, ImageUrl: ${imageUrl}`)

  imageUrl = await ImageHelper.validateAndFixImageUrl(imageUrl)
  if (imageUrl === undefined) {
    console.warn(
      "Could not find a valid image for PostId:",
      postId,
      "Aborting."
    )

    // 2016-07-16: I'm no longer removing the post from Firebase,
    // since this will just re-add it, and trigger this error again on the next check.
    // Now, the post is just left in Firebase as an empty node,
    // which will never be added to a user list

    // console.log("Removing post from Firebase...")
    // await FirebaseClient.GET_INSTANCE().removePost(postId)

    return Promise.resolve()
  }

  let properties = await ImageHelper.requestImageSize(imageUrl)
  console.log(
    `Width: ${properties.width}, Height: ${properties.height}. Updating Firebase...`
  )

  await FirebaseClient.GET_INSTANCE().setPostProperties(postId, properties)
  console.log("Properties saved in Firebase.")

  let post: RedditPost = {
    id: postId,
    type: properties.type,
    imageUrl,
    postUrl,
    width: properties.width,
    height: properties.height,
    dateAdded: moment()
      .utc()
      .unix()
  }

  let interestedUsers = await FirebaseClient.GET_INSTANCE().getInterestedUsers(
    post
  )
  console.log(
    `Found ${interestedUsers.length} user(s) interested in this image.`
  )

  console.log("Adding post to personal list of interested user(s)")
  let promises = []
  for (let i = 0; i < interestedUsers.length; i++) {
    let user = interestedUsers[i]
    // https://github.com/nielsmaerten/peppermint/issues/37
    promises.push(
      FirebaseClient.GET_INSTANCE().addPostToUserList(post, user.id)
    )
  }

  console.log("Adding URL to website images")
  promises.push(FirebaseClient.GET_INSTANCE().addPostToWebsite(post))
  await Promise.all(promises)
}
