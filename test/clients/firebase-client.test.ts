import { assert } from "chai"
import FirebaseClient from "../../src/clients/firebase-client"
import Config from "../../src/objects/config"
import RedditPost from "../../src/objects/reddit-post"
import User from "../../src/objects/user"
import StubCreator from "../helpers/stub-creator"

describe("Firebase Client", () => {
  beforeEach(StubCreator.STUB_FIREBASE)
  afterEach(StubCreator.RESTORE_FIREBASE)

  it("should be a singleton", () => {
    let one = FirebaseClient.GET_INSTANCE()
    let two = FirebaseClient.GET_INSTANCE()

    assert.strictEqual(one, two)
  })

  it("should add a post to Firebase", async () => {
    let firebase = FirebaseClient.GET_INSTANCE()
    let post = new RedditPost("this-is-some-random-stuff")

    assert.isNull(await firebase.getPost(post))
    await firebase.addPost(post)
    assert.isNotNull(await firebase.getPost(post))
  })

  it("should add a new user to Firebase", async () => {
    let firebase = FirebaseClient.GET_INSTANCE()
    let newUser = new User("EXAMPLE_TOKEN" + require("cuid")())

    await firebase.addUser(newUser)
    let userFromDb = await require("firebase-admin")
      .database()
      .ref(`${Config.userListRef}/${newUser.id}`)
      .once("value")
    assert.deepEqual(newUser, userFromDb.val())
  })

  it("should get a list of users interested in a post", async () => {
    let firebase = FirebaseClient.GET_INSTANCE()

    // Add an interested, and an uninterested user
    await firebase.addUser(new User(require("cuid")(), "", 1, 1))
    await firebase.addUser(new User(require("cuid")(), "", 9999, 9999))

    let examplePost = new RedditPost("https://placehold.it/1920x1080")
    examplePost.height = 1080
    examplePost.width = 1920

    let interestedUsers: User[] = await firebase.getInterestedUsers(examplePost)

    assert.equal(interestedUsers.length, 1)
    for (let i = 0; i < interestedUsers.length; i++) {
      assert.isAtLeast(
        examplePost.height,
        interestedUsers[i].prefMinHeight,
        "Image does not meet min heigth"
      )
      // We don't test for minWidth, because that query is presorted by Firebase, but not supported by firebase-mock
      // cf: https://github.com/soumak77/firebase-mock/blob/314419ee18c8505299175a019033f6113d8fa291/tutorials/spies.md
    }
  })

  it("should add a post to a user's personal list", async () => {
    let post = new RedditPost("https://placehold.it/500")
    let testuser = new User("TEST_TOKEN", "", 500, 500)

    await FirebaseClient.GET_INSTANCE().addUser(testuser)
    await FirebaseClient.GET_INSTANCE().addPostToUserList(post, testuser.id)

    let postInUserList = require("firebase-admin")
      .database()
      .ref(
        `${Config.userListRef}/${testuser.id}/${Config.personalLisRef}/${post.id}`
      )
      .getData()

    assert.deepEqual(post, postInUserList)
  })

  it("should get a user token from Firebase", async () => {
    let testToken = require("cuid")()
    let testUser = new User(testToken)

    await FirebaseClient.GET_INSTANCE().addUser(testUser)
    let token = await FirebaseClient.GET_INSTANCE().getUserToken(testUser.id)

    assert.equal(token, testToken)
  })
})
