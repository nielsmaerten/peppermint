/**
 * The code in this file is not meant to run.
 * It's a way of quickly fleshing out some ideas.
 * Also know as cowboy-programming, but without the disadvantages ;)
 */
export default class Peppermint {

  public newImageAdded(urlToImage: string, minWidth: number) {
    if (!database.has(urlToImage)) {
      database.add(urlToImage);
      let imageProperties = this.getImageProperties(urlToImage);
      if (imageProperties.width >= minWidth) {
        // Add to users' dropboxes
        this.addToUsersDropboxes(urlToImage, imageProperties.width);
      } else {
        // Discard the image
      }
    }
  }

  public addImageToDropbox(imageUrl: string, userId: string) {
    // The url is already guaranteed to be 'worthy' of this dropbox, by another func

    // Connect to a dropbox
    let dropbox = this.connectToDropbox(dropboxId);

    if (dropbox.hasFile(urlToImage)) {
      // never mind!
    } else {
      dropbox.uploadFile(urlToImage)
    }
  }

  public addToUsersDropboxes(urlToImage: string, width: number) {
    // Adds the image to the dropboxes of users who allow this minimum width
    let imageProperties = this.getImageProperties(urlToImage);
    let users = database.getUsersWhoAccept(imageProperties);

    // Trigger new cloud functions for each user
    for (let user in users) {
      this.addToDropboxAsync(user, urlToImage);
    }
  }

  public addToDropboxAsync(user: User, urlToImage: string) {
    // Triggers an HTTP cloud function with the userId and the url.
    // Results in a new function-instance running this.addToDropbox
  }

  public getImageProperties(urlToImage: string) {
    // Analyzes this image, and returns some properties such as dimensions
    return {
      width: 1080,
      height: 1000
    }
  }

  public cleanDropbox(dropboxId: string) {
    // TODO: Not really interested in cleaning up right now. Do this later.
    let dropbox = this.connectToDropbox(dropboxId);
    let settings = dropbox.settings;
    if (settings.maxAge) {
      // remove too old files
    }

    for (let file in dropbox.files) {
      if (file.age > settings.maxAge) {
        file.delete();
      }
    }
  }

  public connectToDropbox(dropboxId: string) {
    return {
      hasFile: (file: string) => false,
      uploadFile: (url: string) => {  },
      settings: {},
      files: []
    }
  }
}
