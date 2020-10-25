import { firestore } from 'firebase-admin';
import { logger } from 'firebase-functions';
import DropboxClient from '../clients/destinations/dropbox';
import backoff from '../clients/helpers/backoff';

export default class User {
  dropboxToken?: string;
  maxAge!: number;
  id!: string;
  private dropboxClient: DropboxClient;

  constructor(tokens: any) {
    this.dropboxToken = tokens.dropbox;
    if (this.dropboxToken) {
      this.dropboxClient = new DropboxClient(this.dropboxToken);
    } else throw new Error('Only Dropbox supported for now!');
  }

  /**
   * Upload an image to the user's storage account.
   * To prevent throttling, the upload starts after a random delay
   * and will be retried up to 5 times
   */
  public async uploadImageToStorageProvider(filename: string, imagePath: string) {
    const uploadOperation = () => this.dropboxClient.upload(filename, imagePath);
    try {
      await backoff(uploadOperation, 'Upload', 30, 5, 5);
    } catch (e) {
      logger.error(`Failed uploading ${filename} to user's storage provider`);
    }
  }

  /**
   * Deletes images from the user's storage account.
   * To prevent throttling, the upload starts after a random delay
   * and will be retried up to 5 times
   */
  public async deleteImagesFromStorageProvider(filenames: string[]) {
    const deleteOperation = () => this.dropboxClient.delete(filenames);
    try {
      await backoff(deleteOperation, 'Delete', 30, 5, 5);
    } catch (e) {
      logger.error(`Failed deleting ${filenames} from user's storage provider`);
    }
  }

  /**
   * Removes old images from a user's personal collection, and their Dropbox account
   */
  public async pruneOldImages() {
    // Get the personal image collection
    const imgCollection = firestore().collection('users').doc(this.id).collection('images');
    const maxAddedAge = Date.now() - this.maxAge;

    // Find images older than the maxAge
    logger.info(`Finding images added before ${new Date(maxAddedAge)}`);
    const expiredImages = imgCollection.where('added', '<', maxAddedAge);

    // Pull old image-documents from the database
    const snapshots = await expiredImages.get();
    logger.info(`${snapshots.size} image(s) marked for deletion.`);

    // Delete the images from the Dropbox account
    const filenames = snapshots.docs.map((d) => d.data().id).map((id) => `/${id}.jpg`);
    await this.deleteImagesFromStorageProvider(filenames);

    // Delete the image-documents for the personal collection
    const batch = firestore().batch();
    snapshots.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}
