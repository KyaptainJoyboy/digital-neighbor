/* animation.js */

// Fade out an element after a given delay (in milliseconds)
function fadeOutMessage(element, delay) {
    setTimeout(() => {
      element.style.opacity = "0";
    }, delay);
  }
  