function getSelectedText() {
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  }
  return text;
};

function hotkey(e) {
  if (e.ctrlKey && e.keyCode == 69) {
  var text = getSelectedText();
  if (text) {
    chrome.runtime.sendMessage({text: text,
                                created_at: Date.now(),
                                url: document.URL},
      function(response) {
        console.log(response.farewell);
      });
    }
  }
};

document.addEventListener('keyup', hotkey, false);

// google auth token from website
// var port = chrome.runtime.connect();

// window.addEventListener("message", function(event) {
//   if (event.data.type && (event.data.type == 'auth_token')) {
//     console.log(event.data.token);
//     console.log('auth token received');
//     chrome.runtime.sendMessage(event.data,
//       function(response) {
//         console.log(response.farewell);
//       });
//   }
// }, false);