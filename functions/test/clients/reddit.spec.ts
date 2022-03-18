import RedditClient from '../../src/clients/reddit';

describe.only('Reddit Client', () => {
  it('downloads the latest top posts', async () => {
    const response = await RedditClient.getTopPosts(50, ['earthporn']);

    expect(response.length).toBeGreaterThan(0);
  });
});
