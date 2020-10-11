import * as functions from 'firebase-functions';
import { initializeApp } from 'firebase-admin';

import _fetchNewPosts from './events/fetch-new-posts';
import _newImgFromReddit from './events/new-img-from-reddit';
import _newImgForUser from './events/new-img-for-user';
import _deleteOldImages from './events/delete-old-imgs';

initializeApp();

// Scheduled functions
export const fetchNewPosts = functions.pubsub.schedule('every 4 hours').onRun(_fetchNewPosts);
export const deleteOldImages = functions.pubsub.schedule('every 60 minutes').onRun(_deleteOldImages);

// New image triggers
export const newImgFromReddit = functions.firestore.document('images/{imageId}').onCreate(_newImgFromReddit);
export const newImgForUser = functions
  .runWith({ memory: '2GB' })
  .firestore.document('users/{userId}/images/{imageId}')
  .onCreate(_newImgForUser);

// Manual triggers
export const fetchNewPostsManual = functions.https.onRequest(async (req, res) => {
  await _fetchNewPosts();
  res.send('OK');
});
export const deleteOldImagesManual = functions.https.onRequest(async (req, res) => {
  await _deleteOldImages();
  res.send('OK');
});

// Package info
export const version = require('../package.json').version;
export const userAgent = `nodejs:me.niels.peppermint:${version} (by u/Naerten)`;
