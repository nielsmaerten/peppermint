import * as firebasemock from "firebase-mock"
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import * as sinon from "sinon"

exports.initMockFirebase = () => {
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
    function(path) {
      return mockdatabase.child(path)
    },
    function() {
      return mockauth
    }
  )
  mockdatabase.autoFlush()

  // Stub the existing admin.database() with the mock
  sinon.stub(admin, "database").returns(mocksdk.database())
}
