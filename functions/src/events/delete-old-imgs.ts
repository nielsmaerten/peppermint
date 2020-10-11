import { firestore } from 'firebase-admin';
import { logger } from 'firebase-functions';
import User from '../types/User';

const deleteOldImages = async () => {
  const _24hours = 1000 * 60 * 60 * 24;
  const _24hoursAgo = Date.now() - _24hours;

  // Get all users that require maintenance
  const users = await firestore().collection('users').where('lastMaintained', '<', _24hoursAgo).get();
  logger.info(`Starting maintenance for ${users.size} user(s)`);

  const updates = users.docs.map(async (doc) => {
    // Create user object
    const userData = doc.data();
    const user = new User(userData.tokens);
    Object.assign(user, userData);

    // Delete old images
    logger.info(`Purging old images for ${user.id}`);
    await user.removeOldImages();

    // Update user maintenance date
    await doc.ref.update({ lastMaintained: Date.now() });
    logger.info(`Maintenance complete for ${user.id}`);
  });

  await Promise.all(updates);
  logger.info(`Maintenance complete for all users.`);
};

export default deleteOldImages;
