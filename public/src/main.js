function initialize() {
  var config = {
    apiKey: "AIzaSyCyLae8mciMzv-ul_ehTxzRf_A4Ro8Tx74",
    authDomain: "peppermint-wallpapers.firebaseapp.com",
    databaseURL: "https://peppermint-wallpapers.firebaseio.com",
    projectId: "peppermint-wallpapers",
    storageBucket: "peppermint-wallpapers.appspot.com",
    messagingSenderId: "372016532786"
  };
  firebase.initializeApp(config);
}

function setPreferences() {
  const firebaseSetPreferences = firebase.functions().httpsCallable('setPreferences');

  const prefMaxAge = +prompt("(1/3) After how many days do you want old wallpapers to be deleted?", 30);
  const prefMinWidth = +prompt("(2/3) What should be the minimum with of new wallpapers? (in pixels)", 1920);
  const prefMinHeight = +prompt("(3/3) What should be the minimum height of new wallpapers? (in pixels)", 1080);

  firebaseSetPreferences({ prefMinHeight, prefMinWidth, prefMaxAge })
    .then(() =>
      alert("Got it! Your preferences have been saved.")
    )
    .catch(e => {
      alert("Something went wrong while saving your settings. Check console for details.");
      console.error(e);
    })
}

(function () {
  initialize();
  const hash = window.location.hash;
  if (!hash) { return; }

  const i = hash.indexOf("token=");
  if (i < 0) { return; }

  const token = hash.substr(i + 6)
  firebase.auth().signInWithCustomToken(token);
})()

