import Config from "../objects/config"
import FirebaseClient from "../clients/firebase-client"
import RedditClient from "../clients/reddit-client"

/**
 * Triggered every n minutes.
 * Checks the current list of top-posts on /r/earthporn
 * against an internal master list.
 *
 * If new images exist on Reddit, they are added to the master list
 */
export default async () => {
  let firebase = FirebaseClient.getInstance()
  let topPosts = await RedditClient.getTopPosts(Config.subreddit)

  for (let i = 0; i < topPosts.length; i++) {
    if (!await firebase.getPost(topPosts[i])) {
      await firebase.addPost(topPosts[i])
    }
  }
}
