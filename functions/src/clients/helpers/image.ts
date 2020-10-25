import RedditPost from '../../types/RedditPost';
import axios from 'axios';
import * as im from 'imagemagick';
import { writeFileSync, unlinkSync } from 'fs';
import { userAgentString } from '../../contants';
import { logger } from 'firebase-functions';

/**
 * Provides methods to:
 * - download images
 * - verify image sizes
 * - trim borders from images
 */
export default class ImageClient {
  public static async downloadImage(post: RedditPost) {
    // Download the image into an arraybuffer
    const axiosResponse = await axios.get(post.imgUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': userAgentString,
      },
    });

    // Check the image type, it must be JPEG
    const urlEndsWithJpg = post.imgUrl.toLowerCase().endsWith('.jpg');
    const urlEndsWithJpeg = post.imgUrl.toLowerCase().endsWith('.jpeg');
    const contentTypeIsJpeg = axiosResponse.headers['content-type'] === 'image/jpeg';
    const isJpegImage = urlEndsWithJpg || urlEndsWithJpeg || contentTypeIsJpeg;

    if (!isJpegImage) {
      logger.warn(`${post.id} is not supported because the image is not JPEG.`);
      return {};
    } else {
      logger.info(`${post.id} image was downloaded succesfully.`);
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

  public static cropWhitespace(filePath: string): Promise<string> {
    logger.info(`Cropping whitespace from ${filePath}`);
    return new Promise((resolve, reject) => {
      // Use ImageMagick to 'trim' borders from the image
      const outPath = `${filePath}-cropped.jpg`;
      const inPath = filePath;
      im.convert([inPath, '-trim', outPath], (error) => {
        if (error) reject(error);
        resolve(outPath);
      });
    });
  }

  public static deleteImage(filePath: string) {
    unlinkSync(filePath);
    logger.debug(filePath, 'has been deleted.');
  }
}
