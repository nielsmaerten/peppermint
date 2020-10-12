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
  const users: any[] = await getInterestedUsers(post.width, post.height, post.subreddit);
  functions.logger.info(`Found ${users.length} interested user(s).`);
  const batch = firestore().batch();

  users.forEach((user) => {
    // Bail if user wants only portrait/landscape, but the image isn't
    if (user.onlyPortrait && !post.isPortrait) return;
    if (user.onlyLandscape && !post.isLandscape) return;

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
const getInterestedUsers = async (width: number, height: number, subreddit: string) => {
  // Query users by width from Firestore
  const userSnapshots = await firestore()
    .collection('users')
    .where('subreddits', 'array-contains', subreddit)
    .where('minWidth', '<=', width)
    .get();

  // Filter users by height
  return userSnapshots.docs.map((user) => user.data()).filter((user) => user.minHeight <= height);
};
