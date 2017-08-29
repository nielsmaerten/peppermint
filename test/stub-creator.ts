import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import * as sinon from "sinon"
import * as Q from "q"
import RedditPost from "../src/reddit-post"
import RedditClient from "../src/reddit-client"
import Peppermint from "../src/peppermint"
import Config from "../src/config"

export default class StubCreator {
  /**
   * Stubs a fake array of top posts into RedditClient.getTopPosts()
   */
  public static stubRedditTopPosts() {
    let fakeJson = require("./reddit-test-payload").json
    let fakeTopPosts = RedditClient.parseResponse(fakeJson)
    let fakePromise = Q.resolve(fakeTopPosts)
    sinon.stub(RedditClient, "getTopPosts").returns(fakePromise)
  }

  /**
   * Initializes firebase-admin, and stubs the database with FirebaseMock
   */
  public static stubFirebase() {
    // Stub admin.initializeApp and functions.config().firebase
    let firebasemock = require("firebase-mock")
    let adminInitStub = sinon.stub(admin, "initializeApp")
    let configStub = sinon.stub(functions, "config").returns({
      firebase: {
        // Fake urls, because Firebase complains if we leave them undefined
        databaseURL: "https://mock-firebase.firebaseio.com",
        storageBucket: "mock-firebase.appspot.com"
      }
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

  public static restoreFirebase() {
    ;(admin.initializeApp as any).restore()
    ;(functions.config as any).restore()
    ;(admin.database as any).restore()
  }

  public static restoreRedditClient() {
    ;(RedditClient.getTopPosts as any).restore()
  }

  public static restoreAll = () => {
    StubCreator.restoreFirebase()
    StubCreator.restoreRedditClient()
  }
}
