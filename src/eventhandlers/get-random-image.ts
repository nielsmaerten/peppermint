import FirebaseClient from "../clients/firebase-client"
export default () => {
  const firebaseClient = FirebaseClient.GET_INSTANCE()
  return firebaseClient.getRandomImage()
}
