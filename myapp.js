// myapp.js

var manifestUri = '//storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }
}

function initPlayer() {
  // Create a Player instance.
  var video  = document.getElementById('video');
  var video2 = document.getElementById('video2');
  var video3 = document.getElementById('video3');
  var video4 = document.getElementById('video4');

  var player  = new shaka.Player(video);
  var player2 = new shaka.Player(video2);
  var player3 = new shaka.Player(video3);
  var player4 = new shaka.Player(video4);

  // Attach player to the window to make it easy to access in the JS console.
  window.player = player;


  // Listen for error events.
  player.addEventListener('error', onErrorEvent);
  player2.addEventListener('error', onErrorEvent);
  player3.addEventListener('error', onErrorEvent);
  player4.addEventListener('error', onErrorEvent);

  // Try to load a manifest.
  // This is an asynchronous process.
  player.load(manifestUri).then(function() {
    // This runs if the asynchronous load is successful.
    console.log('Player has now been loaded!');
  }).catch(onError);  // onError is executed if the asynchronous load fails.

  player2.load(manifestUri).then(function() {
    // This runs if the asynchronous load is successful.
    console.log('Player2 has now been loaded!');
  }).catch(onError);  // onError is executed if the asynchronous load fails.
  player3.load(manifestUri).then(function() {
    // This runs if the asynchronous load is successful.
    console.log('Player 3 has now been loaded!');
  }).catch(onError);  // onError is executed if the asynchronous load fails.

  player4.load(manifestUri).then(function() {
    // This runs if the asynchronous load is successful.
    console.log('Player 4 has now been loaded!');
  }).catch(onError);  // onError is executed if the asynchronous load fails.

}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
}

document.addEventListener('DOMContentLoaded', initApp);