import * as functions from 'firebase-functions';

// Export a Firebase Cloud function that returns 200 OK with the current time.
export const helloWorld = functions.https.onRequest((request, response) => {
  const currentTime = new Date().toISOString();
  response.send(`Hello from Firebase! Current time: ${currentTime}`);
});
