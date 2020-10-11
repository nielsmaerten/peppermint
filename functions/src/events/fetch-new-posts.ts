import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import Reddit from '../clients/reddit';
import RedditPost from '../types/RedditPost';

const fetchNewPosts = async () => {
  functions.logger.debug(`[fetch-new-posts]: Fetching new posts from Reddit`);
  const top_posts: RedditPost[] = await Reddit.getTopPosts();

  await addToFirestore(top_posts);
};

const addToFirestore = async (posts: RedditPost[]) => {
  functions.logger.info(`[fetch-new-posts]: Adding ${posts.length} posts to /images`);
  const batch = firestore().batch();

  posts.forEach((post) => {
    const ref = firestore().doc(`images/${post.id}`);
    batch.set(ref, post);
  });

  await batch.commit();
  functions.logger.info(`[fetch-new-posts]: Done`);
};

export default fetchNewPosts;
