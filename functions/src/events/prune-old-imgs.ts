import { firestore } from 'firebase-admin';
import { logger } from 'firebase-functions';
import { pruningInterval } from '../constants';
import User from '../types/User';

const pruneOldImages = async () => {
  // Get all users that require pruning
  const users = await firestore().collection('users').where('lastMaintained', '<', pruningInterval).get();
  logger.info(`Pruning personal collections of ${users.size} user(s)`);

  const updates = users.docs.map(async (doc) => {
    // Create user object
    const userData = doc.data();
    const user = new User(userData.tokens);
    Object.assign(user, userData);

    // Delete old images
    logger.info(`Pruning old images for ${user.id}`);
    await user.pruneOldImages();

    // Update user maintenance date
    await doc.ref.update({ lastMaintained: Date.now() });
    logger.info(`Pruning complete for ${user.id}`);
  });

  await Promise.all(updates);
  logger.info(`Pruning complete for all users.`);
};

export default pruneOldImages;
