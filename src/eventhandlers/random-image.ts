import FirebaseClient from "../clients/firebase-client"
import RedditPost from "../objects/reddit-post";

export default async (req: any): Promise<string> => {
  const post: RedditPost = await FirebaseClient.GET_INSTANCE().getRandomPost();
  return post.imageUrl
}

