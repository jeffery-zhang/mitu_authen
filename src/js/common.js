import './../css/global.scss';
import './../css/common.scss';

const ua = navigator.userAgent;

function isIOS() {
  return ua.includes('iPad') || ua.includes('iPhone');
}

function isAndroid() {
  return ua.includes('Android');
}

function shutPage() {
  if (isIOS()) {
    window.webkit.messageHandlers.callFunc.postMessage('MT://authentication/commit');
  }
  if (isAndroid()) {
    android.callFunc('MT://authentication/commit');
  }
}

function showNotify(text, callback) {
  $('.notify').removeClass('hidden').text(text);
  setTimeout(() => {
    $('.notify').addClass('hidden');
    if (callback) {
      callback();
    }
  }, 3000);
}

export default {
  shutPage,
  showNotify,
}