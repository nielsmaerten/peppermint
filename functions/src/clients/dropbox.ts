import { Dropbox } from 'dropbox';
import { logger } from 'firebase-functions';
import { readFileSync } from 'fs';

export default class DropboxClient {
  private dropbox: Dropbox;

  constructor(token: string) {
    this.dropbox = new Dropbox({ accessToken: token });
  }

  async upload(filename: string, imagePath: string) {
    await this.dropbox.filesUpload({
      contents: readFileSync(imagePath),
      path: `/${filename}`,
      mute: true,
    });
    logger.info(`${filename}: uploaded to Dropbox OK`);
  }

  async delete(filenames: string[]) {
    if (filenames.length === 0) return;
    try {
      await this.dropbox.filesDeleteBatch({
        entries: filenames.map((filename) => {
          return { path: filename };
        }),
      });
      logger.info(`${filenames.join(', ')}: deleted from Dropbox OK`);
    } catch (error) {
      logger.error(`${filenames.join(', ')}: deleting from dropbox failed`);
    }
  }
}
