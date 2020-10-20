import { firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import ImageClient from '../clients/image';
import RedditPost from '../types/RedditPost';
import User from '../types/User';

const newImgForUser = async (snapshot: QueryDocumentSnapshot, context: functions.EventContext) => {
  // Build the user's object
  const { userId, imageId } = context.params;
  const userSnapshot = await firestore().doc(`users/${userId}`).get();
  const userDoc = userSnapshot.data();
  const { minWidth, minHeight, tokens } = userDoc as any;
  const user = new User(tokens);
  Object.assign(user, userDoc);

  // Build the Reddit Post instance
  const redditPost = snapshot.data() as RedditPost;

  // Download the image and run a few checks
  const { buffer, ext, filePath } = await ImageClient.downloadImage(redditPost);

  if (!buffer || !filePath) {
    functions.logger.warn(`${imageId} is invalid: Image not downloadable.`);
    return;
  }

  if (ext && !['jpg', 'jpeg'].includes(ext)) {
    functions.logger.warn(`${imageId} is invalid: Image fromat must be JPEG.`);
    return;
  }

  // Crop whitespace from the image
  const croppedPath = await ImageClient.cropWhitespace(filePath);
  if (!ImageClient.verifySizeReqs(croppedPath, minWidth, minHeight)) {
    functions.logger.warn(`${imageId} is invalid: Cropped image too small.`);
  }

  // Upload to user's storage provider
  functions.logger.info(`${imageId} has passed all checks. Uploading.`);
  await user.uploadImageToStorageProvider(`${imageId}.${ext}`, filePath);

  // Delete image from temp folder
  ImageClient.deleteImage(filePath);
  return;
};

export default newImgForUser;
