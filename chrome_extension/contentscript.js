function getSelectedText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
};

function hotkey(e) {
  if (e.ctrlKey && e.keyCode == 69) {
    text = getSelectedText();
    if (text) {
        chrome.runtime.sendMessage({text: text}, function(response) {
            console.log(response.farewell);
        });
    }
  }
};

document.addEventListener('keyup', hotkey, false);