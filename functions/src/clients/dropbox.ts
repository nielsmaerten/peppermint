import { Dropbox } from 'dropbox';
import { logger } from 'firebase-functions';
import { readFileSync } from 'fs';

export default class DropboxClient {
  private dropbox: Dropbox;

  constructor(token: string) {
    this.dropbox = new Dropbox({ accessToken: token });
  }

  upload(filename: string, imagePath: string) {
    return new Promise<void>(async (resolve, reject) => {

      const dropboxResponse = (await this.dropbox
        .filesUpload({
          contents: readFileSync(imagePath),
          path: `/${filename}`,
          mute: true,
          mode: 'overwrite' as any,
        })) as any;

      if (dropboxResponse.status && dropboxResponse.status !== 200) {
        logger.error(`${filename}: upload to Dropbox failed`);
        reject();
      } else {
        logger.info(`${filename}: upload to Dropbox OK`);
        resolve();
      }

    });
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
    } catch (err) {
      logger.error(`${filenames.join(', ')}: deleting from dropbox failed: ${err}`);
      throw err;
    }
  }
}
