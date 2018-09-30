import FirebaseClient from "../clients/firebase-client"
export default (img: number) => {
  const firebaseClient = FirebaseClient.GET_INSTANCE()
  return firebaseClient.getWebsiteImage(img)
}
