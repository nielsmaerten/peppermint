import { firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

const newUser = async (snapshot: QueryDocumentSnapshot, context: functions.EventContext) => {
  // Get the user's object
  const user = snapshot.data();

  // Get the most recent images from the master list
  const images = await firestore().collection('images').orderBy('added', 'desc').limit(20).get();

  // Add the images to the user's list
  const batch = firestore().batch();
  const userImgCollectionRef = firestore().collection('users').doc(user.id).collection('images');
  images.docs
    // Get image objects
    .map((img) => img.data())

    // Filter out images that don't meet minimum height/width requirements
    .filter((img) => {
      const isSizeOk = img.height >= user.minHeight && img.width >= user.minWidth;
      return isSizeOk;
    })

    // Filter out images that don't meet orientation requirement
    .filter((img) => {
      if (user.onlyLandscape && img.isPortrait) return false;
      if (user.onlyPortrait && img.isLandscape) return false;
      return true;
    })

    // Filter out images that don't meet subreddit requirement
    .filter((img) => {
      const subs = user.subreddits as string[];
      return subs.includes(img.subreddit);
    })

    // Write image object to user's personal collection
    .map((img) => {
      batch.set(userImgCollectionRef.doc(img.id), img);
    });
  await batch.commit();
};

export default newUser;
