import { firestore } from 'firebase-admin';
import { logger } from 'firebase-functions';
import DropboxClient from '../clients/dropbox';

export default class User {
  dropboxToken?: string;
  maxAge!: number;
  id!: string;
  singleFolder = true;
  private dropboxClient: DropboxClient;

  constructor(tokens: any) {
    this.dropboxToken = tokens.dropbox;
    if (this.dropboxToken) {
      this.dropboxClient = new DropboxClient(this.dropboxToken);
    } else throw new Error('Only Dropbox supported for now!');
  }

  public async uploadImageToStorageProvider(filename: string, imageBuffer: Buffer) {
    await this.dropboxClient.upload(filename, imageBuffer);
  }

  public async deleteImagesFromStorageProvider(filenames: string[]) {
    await this.dropboxClient.delete(filenames);
  }

  public async removeOldImages() {
    const imgCollection = firestore().collection('users').doc(this.id).collection('images');
    const maxAddedAge = Date.now() - this.maxAge;

    logger.info(`Finding images added before ${new Date(maxAddedAge)}`);
    const expiredImages = imgCollection.where('added', '<', maxAddedAge);

    const snapshots = await expiredImages.get();
    logger.info(`${snapshots.size} image(s) marked for deletion.`);

    const filenames = snapshots.docs.map((d) => d.data().id).map((id) => `/${id}.jpg`);
    // TODO: Feature: upload-into-subfolders: This will fail if user has enabled subfolders
    await this.deleteImagesFromStorageProvider(filenames);

    const batch = firestore().batch();
    snapshots.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}
