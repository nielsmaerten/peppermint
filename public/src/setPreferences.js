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

  const prefMinWidth = +prompt("(1/3) Minimum width for new wallpapers:", 1920);
  const prefMinHeight = +prompt("(2/3) Minimum height for new wallpapers:", 1080);
  const prefMaxAge = +prompt("(3/3) Delete old wallpapers after how many days?:", 30);

  firebaseSetPreferences({ prefMinHeight, prefMinWidth, prefMaxAge })
    .then(() =>
      alert("Got it! Your preferences have been saved.")
    )
    .catch(e => {
      alert("Something went wrong. Try reconnecting your Dropbox.");
      window.location.href = "/#connect-dropbox";
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
  firebase.auth().signInWithCustomToken(token).then(function () {
    fbq('track', 'CompleteRegistration');
    window.location.href = "/#settings";
  });
})()

