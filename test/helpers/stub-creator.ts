import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import * as Q from "q"
import * as sinon from "sinon"
import RedditClient from "../../src/clients/reddit-client"
import RedditPost from "../../src/objects/reddit-post"

export default class StubCreator {
  /**
   * Stubs a fake array of top posts into RedditClient.GET_TOP_POSTS()
   */
  public static STUB_REDDIT_TOP_POSTS() {
    let fakeJson = require("./reddit-test-payload").json
    let fakeTopPosts = RedditClient.PARSE_RESPONSE(fakeJson)
    let fakePromise = Q.resolve(fakeTopPosts)
    sinon.stub(RedditClient, "GET_TOP_POSTS").returns(fakePromise)
  }

  /**
   * Initializes firebase-admin, and stubs the database with FirebaseMock
   */
  public static STUB_FIREBASE() {
    // Stub admin.initializeApp and functions.config().firebase
    let firebasemock = require("firebase-mock")
    sinon.stub(admin, "initializeApp")
    sinon.stub(functions, "config").returns({
      firebase: {
        // Fake urls, because Firebase complains if we leave them undefined
        databaseURL: "https://mock-firebase.firebaseio.com",
        storageBucket: "mock-firebase.appspot.com"
      },
      peppermint: {
        maintenanceinterval: 1
      },
      dropbox: {},
      oauth: {}
    })

    // Create stub firebase database and enable autoflushing
    let mockdatabase = new firebasemock.MockFirebase()
    let mockauth = new firebasemock.MockFirebase()
    let mocksdk = firebasemock.MockFirebaseSdk(
      (path: any) => mockdatabase.child(path),
      () => mockauth
    )
    mockdatabase.autoFlush()

    // Stub the existing admin.database() with the stub
    sinon.stub(admin, "database").returns(mocksdk.database())
    sinon.stub(admin, "auth").returns({
      createCustomToken: () => "CUSTOM-TEST-TOKEN"
    })
  }

  /**
   * Gets the current list of top posts from RedditClient.GET_TOP_POSTS.
   * Then adds @param newPost to the list, and stubs RedditClient with the new list
   * @param newPost New post to add to the mock GET_TOP_POSTS call
   */
  public static async ADD_POST_TO_STUB(newPost: RedditPost) {
    // Get the current list of topPosts
    let posts = await RedditClient.GET_TOP_POSTS()

    // Restore the stub to its original state
    ;(RedditClient.GET_TOP_POSTS as any).restore()

    // Add the newPost to the list
    posts.push(newPost)

    // Re-stub with the augmented list
    sinon.stub(RedditClient, "GET_TOP_POSTS").returns(Q.resolve(posts))
  }

  public static RESTORE_FIREBASE() {
    ;(admin.initializeApp as any).restore()
    ;(functions.config as any).restore()
    ;(admin.database as any).restore()
    ;(admin.auth as any).restore()
  }

  public static RESTORE_REDDIT_CLIENT() {
    ;(RedditClient.GET_TOP_POSTS as any).restore()
  }

  public static restoreAll = () => {
    StubCreator.RESTORE_FIREBASE()
    StubCreator.RESTORE_REDDIT_CLIENT()
  }
}
