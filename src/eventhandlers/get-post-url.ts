import FirebaseClient from "../clients/firebase-client"
export default (imageId: string) => {
  const firebaseClient = FirebaseClient.GET_INSTANCE()
  return firebaseClient.getPostUrl(imageId)
}
