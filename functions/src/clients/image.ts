import RedditPost from '../types/RedditPost';
import axios from 'axios';
import * as functions from 'firebase-functions';
import * as im from 'imagemagick';
import { writeFileSync } from 'fs';
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
    const isJpegImage = urlEndsWithJpg || urlEndsWithJpeg || contentTypeIsJpeg;

    if (!isJpegImage) {
      functions.logger.warn(`${post.id} is not supported because the image is not JPEG.`);
      return {};
    } else {
      functions.logger.info(`${post.id} image was downloaded succesfully.`);
    }

    // Write image to tmp folder
    const filePath = `/tmp/${Math.floor(Math.random() * 100000000)}.jpg`;
    writeFileSync(filePath, axiosResponse.data);

    return {
      buffer: axiosResponse.data,
      ext: 'jpg',
      filePath,
    };
  }

  public static async verifySizeReqs(
    filePath: string,
    minWidth: number,
    minHeight: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Use ImageMagick to get the dimensions of the image
      im.identify(filePath, function (err, img) {
        if (err) reject(err);
        // Does the image meet the minimum size reqs?
        const isSizeOK = img.height! >= minHeight && img.width! >= minWidth;
        resolve(isSizeOK);
      });
    });
  }

  public static async cropWhitespace(filePath: string) {
    return new Promise((resolve, reject) => {
      // Use ImageMagick to 'trim' borders from the image
      // write the result back to the same file
      im.convert([filePath, '-trim', filePath], (error) => {
        if (error) reject(error);
        resolve(filePath);
      });
    });
  }
}
