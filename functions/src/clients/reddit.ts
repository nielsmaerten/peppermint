// import axios, { AxiosRequestConfig } from 'axios';
import { createHash } from 'crypto';
import * as functions from 'firebase-functions';
import RedditPost from '../types/RedditPost';
import { userAgent } from '../';
import { firestore } from 'firebase-admin';
import * as snoowrap from 'snoowrap';

export default class RedditClient {
  public static async getTopPosts(count = 50, _subreddits?: string[]): Promise<RedditPost[]> {
    const subreddits = _subreddits ?? (await this.getSubReddits());
    const promises = subreddits.map((sub) => this.getTopPostsFromSub(count, sub));
    const allSubs = await Promise.all(promises);
    const allPosts = new Array<RedditPost>();
    return allPosts.concat(...allSubs);
  }

  public static async getTopPostsFromSub(count: number, subreddit: string): Promise<RedditPost[]> {
    // Configure Snoowrap
    const r = new snoowrap({
      userAgent: userAgent,
      clientId: functions.config().reddit?.client_id || '',
      clientSecret: functions.config().reddit?.client_secret|| '',
      refreshToken: functions.config().reddit?.refresh_token || '',
    });

    // Get the top posts from the subreddit
    const posts = await r.getSubreddit(subreddit).getTop({ time: 'day', limit: count });
    return this.getRedditPosts(posts, subreddit);
  }

  private static getRedditPosts(data: snoowrap.Listing<snoowrap.Submission>, subreddit = "N/A"): RedditPost[] {
    return data
      .filter((post) => {
        return post.preview?.images[0] !== undefined;
      })
      .map((post) => {
        return {
          width: post.preview.images[0].source.width,
          height: post.preview.images[0].source.height,
          subreddit,
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

  private static async getSubReddits() {
    const snapshot = await firestore().collection('subreddits').get();
    const docs = snapshot.docs;
    const subreddits = docs.map((doc) => doc.data().id as string);
    functions.logger.info('Fetching posts from these subs:', subreddits);
    return subreddits;
  }

  private static getPostId(url: string): string {
    const shasum = createHash('sha1');
    shasum.update(url);
    return shasum.digest('hex');
  }
}
