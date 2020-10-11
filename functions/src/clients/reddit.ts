import axios, { AxiosRequestConfig } from 'axios';
import { createHash } from 'crypto';
import * as functions from 'firebase-functions';
import RedditPost from '../types/RedditPost';
import { userAgent } from '../';

export default class RedditClient {
  public static async getTopPosts(count = 50, subreddit = 'earthporn'): Promise<RedditPost[]> {
    // Configure Request
    const request: AxiosRequestConfig = {
      baseURL: 'https://reddit.com',
      url: `/r/${subreddit}/top/.json?limit=${count}`,
      headers: {
        'User-Agent': userAgent,
      },
    };

    // Send request
    functions.logger.debug(`[reddit-client]: HTTP request: ${request.url}`);
    const axiosResponse = await axios.request(request);

    // Extract RedditPosts
    const redditPosts = this.getRedditPosts(axiosResponse.data);
    return redditPosts;
  }

  private static getRedditPosts(data: any): RedditPost[] {
    const children: any[] = data.data.children;
    return children
      .map((child) => child.data)
      .map((post) => {
        return {
          width: post.preview.images[0].source.width,
          height: post.preview.images[0].source.height,
          subreddit: String(post.subreddit).toLowerCase(),
          title: post.title,
          imgUrl: post.url,
          postUrl: post.permalink,
          added: Date.now(),
        };
      })
      .map((post) => {
        return {
          ...post,
          id: this.getPostId(post.postUrl),
          isPortrait: post.width < post.height,
          isLandscape: post.width > post.height,
        };
      });
  }

  private static getPostId(url: string): string {
    const shasum = createHash('sha1');
    shasum.update(url);
    return shasum.digest('hex');
  }
}
