/**
 * A Destination is a storage provider like Dropbox, OneDrive, Google Drive, ...
 * This is where we store someone's personal images
 */
export default interface iDestination {
  upload(filename: string, imagePath: string): Promise<void>;
  delete(filenames: string[]): Promise<void>;
}
