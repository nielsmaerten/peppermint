import { firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

const newUser = async (change: functions.Change<QueryDocumentSnapshot>, context: functions.EventContext) => {
  // Get the user's object
  const user = change.after.data();
  if (user.triggerSeeding !== true) return;

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

  // Set seeding trigger switch back to false
  batch.set(change.after.ref, { triggerSeeding: false }, { merge: true });
  return batch.commit();
};

export default newUser;
