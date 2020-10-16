import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { firestore } from 'firebase-admin';
import RedditPost from '../types/RedditPost';

const newImgFromReddit = async (snapshot: QueryDocumentSnapshot, context: functions.EventContext) => {
  const post = snapshot.data() as RedditPost;
  functions.logger.info(
    `New post [${post.width}x${post.height}] added from Reddit.`,
    `Getting interested users.`
  );

  // Get User objects from query
  const users: any[] = await getInterestedUsers(post);
  functions.logger.info(`Found ${users.length} interested user(s).`);
  const batch = firestore().batch();

  users.forEach((user) => {
    // Image matches the user's requirements: add it to their collection
    const ref = firestore().doc(`users/${user.id}`).collection('images').doc(post.id);
    batch.create(ref, post);
  });
  return batch.commit();
};

export default newImgFromReddit;

/**
 * Gets all users who accept an image of this width and height
 */
const getInterestedUsers = async (post: RedditPost) => {
  const { subreddit, width, height, isLandscape, isPortrait } = post;

  // Query users for whom image meets minWidth and subreddit requirement
  const userSnapshots = await firestore()
    .collection('users')
    .where('subreddits', 'array-contains', subreddit)
    .where('minWidth', '<=', width)
    .get();

  return (
    userSnapshots.docs
      // Get user objects
      .map((user) => user.data())

      // Filter users for whom image doesn't meet minHeight requirement
      .filter((user) => user.minHeight <= height)

      // Filter users for whom image doesn't meet orientation requirement
      .filter((user) => {
        if (user.onlyLandscape && isPortrait) return false;
        if (user.onlyPortrait && isLandscape) return false;
        return true;
      })
  );
};
