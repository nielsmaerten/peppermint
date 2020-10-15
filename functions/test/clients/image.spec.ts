import ImageClient from '../../src/clients/image';

const testPost = {
  imgUrl: 'https://placehold.it/400x500.jpg',
};

describe('Image Client', () => {
  it('can download images from web', async () => {
    const response = await ImageClient.downloadImage(testPost as any);

    expect(response.ext).toEqual('jpg');
    expect(response.buffer).toBeDefined();
    expect(response.filePath).toBeDefined();
  });

  it('can crop images', async () => {
    const response = await ImageClient.downloadImage(testPost as any);

    if (!response.filePath) {
      throw new Error('File download failed.');
    }
    const result = await ImageClient.cropWhitespace(response.filePath);
    expect(result).toBeDefined();
  });
});
