function dropHandler(ev) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        lookup(file.name)
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      lookup(ev.dataTransfer.files[i].name);
    }
  }
}

function dragOverHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

function lookup(filename) {
  fbq('track', 'ImageLookup');
  var id = /[a-zA-Z0-9]+/.exec(filename)[0]
  var url =
    "https://us-central1-peppermint-wallpapers.cloudfunctions.net/lookupImageCredits?id=" +
    id
  window.location.href = url
}
