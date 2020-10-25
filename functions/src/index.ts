import * as functions from 'firebase-functions';
import { initializeApp } from 'firebase-admin';
import { maximumFunctionRuntime, intervals } from './contants';

import _fetchNewPosts from './events/fetch-new-posts';
import _newImgFromReddit from './events/new-img-from-reddit';
import _newImgForUser from './events/new-img-for-user';
import _pruneOldImages from './events/prune-old-imgs';
import _newUser from './events/new-user';

initializeApp();

// Check sources (Reddit) for new content
export const fetchNewPosts = functions.pubsub.schedule(intervals.fetchNewPosts).onRun(_fetchNewPosts);

// Prune old images from user storage (Dropbox)
export const pruneOldImages = functions.pubsub.schedule(intervals.fetchNewPosts).onRun(_pruneOldImages);

// A new image being added to the master collection
export const newImgFromReddit = functions.firestore.document('images/{imageId}').onCreate(_newImgFromReddit);

// A new image being added to a user's personal collection
export const newImgForUser = functions
  .runWith({ timeoutSeconds: maximumFunctionRuntime })
  .firestore.document('users/{userId}/images/{imageId}')
  .onCreate(_newImgForUser);
export const newUser = functions.firestore.document('users/{userId}').onUpdate(_newUser);

// Manual triggers
export const fetchNewPostsManual = functions.https.onRequest(async (req, res) => {
  await _fetchNewPosts();
  res.send('OK');
});
export const deleteOldImagesManual = functions.https.onRequest(async (req, res) => {
  await _pruneOldImages();
  res.send('OK');
});
