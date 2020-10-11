import { Dropbox } from 'dropbox';
import { logger } from 'firebase-functions';

export default class DropboxClient {
  private dropbox: Dropbox;

  constructor(token: string) {
    this.dropbox = new Dropbox({ accessToken: token });
  }

  async upload(filename: string, buffer: Buffer) {
    await this.dropbox.filesUpload({
      contents: buffer,
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
