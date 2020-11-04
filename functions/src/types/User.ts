import { firestore } from 'firebase-admin';
import { logger } from 'firebase-functions';
import DropboxClient from '../clients/dropbox';
import * as backoff from 'backoff';

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

  public async uploadImageToStorageProvider(filename: string, imagePath: string) {
    const uploadOperation = () => this.dropboxClient.upload(filename, imagePath);
    try {
      await this.useBackoff(uploadOperation, 'Upload');
    } catch (e) {
      logger.error(`Failed uploading ${filename} to user's storage provider`);
    }
  }

  public async deleteImagesFromStorageProvider(filenames: string[]) {
    const deleteOperation = () => this.dropboxClient.delete(filenames);
    try {
      await this.useBackoff(deleteOperation, 'Delete');
    } catch (e) {
      logger.error(`Failed deleting ${filenames} from user's ${this.id} storage provider`);
    }
  }

  public async removeOldImages() {
    const imgCollection = firestore().collection('users').doc(this.id).collection('images');
    const maxAddedAge = Date.now() - this.maxAge;

    logger.info(`Finding images added before ${new Date(maxAddedAge)}`);
    const expiredImages = imgCollection.where('added', '<', maxAddedAge);

    const snapshots = await expiredImages.get();
    logger.info(`${snapshots.size} image(s) marked for deletion.`);

    const filenames = snapshots.docs.map((d) => d.data().id).map((id) => `/${id}.jpg`);
    await this.deleteImagesFromStorageProvider(filenames);

    const batch = firestore().batch();
    snapshots.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }

  /**
   * Retries the operation up to 5 times with increasing timeouts in between.
   * Use this to avoid API throttling from the Storage Provider
   */
  private useBackoff(operation: () => Promise<void>, opName: string) {
    return new Promise<void>((resolve, reject) => {
      const _backoff = backoff.exponential({
        // Wait max. 1 minute between retries
        maxDelay: 60 * 1000,

        // Wait a few seconds before the first try
        initialDelay: Math.random() * 10 * 1000,
      });

      // How many retries are allowed
      _backoff.failAfter(5);

      // If all retries fail, reject the promise
      _backoff.on('fail', () => {
        logger.error(`Reached max. attempts. Won't try any further`);
        reject();
      });

      // On each try...
      _backoff.on('ready', (attempt, delay) => {
        // ... log the attempt number and how much it was delayed
        logger.info(`${opName} attempt nr ${attempt + 1} after ${delay}ms`);

        // ... try executing the operation
        operation().then(resolve, (error) => {
          logger.warn(error);
          _backoff.backoff();
        });
      });
      _backoff.backoff();
    });
  }
}
