import RedditPost from '../types/RedditPost';
import axios from 'axios';
import * as functions from 'firebase-functions';
import * as jimp from 'jimp';
import { userAgent } from '..';

export default class ImageClient {
  public static async downloadImage(post: RedditPost) {
    // Download the image into an arraybuffer
    const axiosResponse = await axios.get(post.imgUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': userAgent,
      },
    });

    // Check the image type, it must be JPEG
    const urlEndsWithJpg = post.imgUrl.toLowerCase().endsWith('.jpg');
    const urlEndsWithJpeg = post.imgUrl.toLowerCase().endsWith('.jpeg');
    const contentTypeIsJpeg = axiosResponse.headers['content-type'] === 'image/jpeg';
    if (urlEndsWithJpg || urlEndsWithJpeg || contentTypeIsJpeg) {
      functions.logger.info(`${post.id} image was downloaded succesfully.`);
      return {
        buffer: axiosResponse.data,
        ext: 'jpg',
      };
    } else {
      functions.logger.warn(`${post.id} is not supported because the image is not JPEG.`);
      return {};
    }
  }

  public static async verifySizeReqs(buffer: Buffer, minWidth: number, minHeight: number): Promise<boolean> {
    const image = await jimp.read(buffer);
    return image.getHeight() >= minHeight && image.getWidth() >= minWidth;
  }

  public static async cropWhitespace(buffer: Buffer) {
    const original = await jimp.read(buffer);
    const cropped = original.autocrop();
    const diff = {
      width: original.getWidth() - cropped.getWidth(),
      height: original.getHeight() - cropped.getHeight(),
    };
    if (diff.height > 10 || diff.width > 10) {
      functions.logger.warn(`Cropped ${diff.width}x${diff.height} of whitespace from image.`);
      return cropped.getBufferAsync('image/jpeg');
    } else {
      functions.logger.info(`No whitespace detected. Using original image.`);
      return buffer;
    }
  }
}
