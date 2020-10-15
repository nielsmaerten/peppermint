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
    .map((img) => img.data())
    .filter((img) => {
      const isSizeOk = img.height >= user.minHeight && img.width >= user.minWidth;
      const isOrientationOK = true;
      // (user.onlyLandscape && img.isPortrait) || (user.onlyPortrait && img.isLandscape);
      return isSizeOk && isOrientationOK;
    })
    .map((img) => {
      batch.set(userImgCollectionRef.doc(img.id), img);
    });
  await batch.commit();
};

export default newUser;
