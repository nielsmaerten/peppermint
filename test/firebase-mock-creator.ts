import * as firebasemock from "firebase-mock"
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import * as sinon from "sinon"
import * as Q from "q"
import RedditPost from "../src/reddit-post"
import Config from "../src/config"

export default class FirebaseMockCreator {
  public static examplePosts = [
    new RedditPost("https://placehold.it/250x250"),
    new RedditPost("https://placehold.it/2500x2500"),
    new RedditPost("https://placehold.it/980x1080"),
    new RedditPost("https://placehold.it/568x720")
  ]

  public static initMockFirebase(): Q.Promise<any[]> {
    this.setup()

    // Fill with mock data
    let promises = this.examplePosts.map(p =>
      admin
        .database()
        .ref(`${Config.masterListsRef}/${Config.subreddit}/${p.id}`)
        .set(p)
    )
    return Q.all(promises)
  }

  private static setup() {
    // Mock admin.initializeApp and functions.config().firebase
    let adminInitStub = sinon.stub(admin, "initializeApp")
    let configStub = sinon.stub(functions, "config").returns({
      firebase: {
        databaseURL: "https://mock-firebase.firebaseio.com",
        storageBucket: "mock-firebase.appspot.com"
      }
    })

    // Create mock firebase database and enable autoflushing
    let mockdatabase = new firebasemock.MockFirebase()
    let mockauth = new firebasemock.MockFirebase()
    let mocksdk = firebasemock.MockFirebaseSdk(
      path => mockdatabase.child(path),
      () => mockauth
    )
    mockdatabase.autoFlush()

    // Stub the existing admin.database() with the mock
    sinon.stub(admin, "database").returns(mocksdk.database())
  }
}
