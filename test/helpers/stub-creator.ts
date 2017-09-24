import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import * as Q from "q"
import * as sinon from "sinon"
import RedditClient from "../../src/clients/reddit-client"

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
  }

  public static RESTORE_FIREBASE() {
    ;(admin.initializeApp as any).restore()
    ;(functions.config as any).restore()
    ;(admin.database as any).restore()
  }

  public static RESTORE_REDDIT_CLIENT() {
    ;(RedditClient.GET_TOP_POSTS as any).restore()
  }

  public static restoreAll = () => {
    StubCreator.RESTORE_FIREBASE()
    StubCreator.RESTORE_REDDIT_CLIENT()
  }
}
