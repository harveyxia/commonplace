dataRef = new Firebase("https://popping-fire-7822.firebaseio.com");

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // var dataRef = new Firebase("https://popping-fire-7822.firebaseio.com");
    if (request.text) {
      sendResponse({farewell: request.text});
      dataRef.set(request.text);
    }
  });