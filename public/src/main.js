const hash = String(Location.hash)
if (!Location.hash) { return; }

const i = Location.hash.indexOf("token=");
if (i < 0) { return; }


const token = hash.substr(i + 6)
console.log("Your sign in token is", token);

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
  apiKey: "AIzaSyCyLae8mciMzv-ul_ehTxzRf_A4Ro8Tx74",
  authDomain: "peppermint-wallpapers.firebaseapp.com",
  databaseURL: "https://peppermint-wallpapers.firebaseio.com",
  projectId: "peppermint-wallpapers",
  storageBucket: "peppermint-wallpapers.appspot.com",
  messagingSenderId: "372016532786"
};
firebase.initializeApp(config);

firebase.auth().signInWithCustomToken(token);

firebase.auth().onAuthStateChanged(user => {
  console.log(user)
})
