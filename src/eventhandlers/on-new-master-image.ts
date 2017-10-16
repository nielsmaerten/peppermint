import moment from "moment"
import FirebaseClient from "../clients/firebase-client"
import getImageProperties from "../objects/image-properties"
import RedditPost from "../objects/reddit-post"

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
export default async (event: any) => {
  let postId = event.params.postId
  let imageUrl = event.data.val().imageUrl
  console.log(`Getting properties for PostId: ${postId}, ImageUrl: ${imageUrl}`)

  let properties = await getImageProperties(imageUrl)
  console.log(
    `Width: ${properties.width}, Height: ${properties.height}. Updating Firebase...`
  )

  await FirebaseClient.GET_INSTANCE().setPostProperties(postId, properties)
  console.log("Properties saved in Firebase.")

  let post: RedditPost = {
    id: postId,
    type: properties.type,
    imageUrl: imageUrl,
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
  for (let i = 0; i < interestedUsers.length; i++) {
    let user = interestedUsers[i]
    // https://github.com/nielsmaerten/peppermint/issues/37
    await FirebaseClient.GET_INSTANCE().addPostToUserList(post, user.id)
  }
}
