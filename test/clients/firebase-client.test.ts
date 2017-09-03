import * as Q from "q"
import { assert, expect } from "chai"
import FirebaseClient from "../../src/clients/firebase-client"
import RedditClient from "../../src/clients/reddit-client"
import RedditPost from "../../src/objects/reddit-post"
import Config from "../../src/objects/config"
import User from "../../src/objects/user"
import StubCreator from "../helpers/stub-creator"

describe("Firebase Client", () => {
  beforeEach(StubCreator.stubFirebase)
  afterEach(StubCreator.restoreFirebase)

  it("should be a singleton", () => {
    let one = FirebaseClient.getInstance()
    let two = FirebaseClient.getInstance()

    assert.strictEqual(one, two)
  })

  it("should add a post to Firebase", async () => {
    let firebase = FirebaseClient.getInstance()
    let post = new RedditPost("this-is-some-random-stuff")

    assert.isNull(await firebase.getPost(post))
    await firebase.addPost(post)
    assert.isNotNull(await firebase.getPost(post))
  })

  it("should add a new user to Firebase", async () => {
    let firebase = FirebaseClient.getInstance()
    let newUser = new User("EXAMPLE_TOKEN" + require("cuid")())

    await firebase.addUser(newUser)
    let userFromDb = await require("firebase-admin")
      .database()
      .ref(`${Config.userListRef}/${newUser.id}`)
      .once("value")
    assert.deepEqual(newUser, userFromDb.val())
  })

  it("should get a list of users interested in a post", async () => {
    let firebase = FirebaseClient.getInstance()
    let getRandomHeight = () => Math.floor(Math.random() * 8000) + 750
    let getRandomWidth = () => Math.floor(Math.random() * 10000) + 1000

    // Add random users
    let testUsers = []
    for (let i = 0; i < 100; i++) {
      await firebase.addUser(
        new User(require("cuid")(), getRandomWidth(), getRandomHeight())
      )
    }

    let examplePost = new RedditPost("https://placehold.it/1920x1080")
    examplePost.height = getRandomHeight()
    examplePost.width = getRandomWidth()

    let interestedUsers: User[] = await firebase.getInterestedUsers(examplePost)

    assert.isAtLeast(interestedUsers.length, 1)
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
})
