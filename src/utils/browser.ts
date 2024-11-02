import { Browser } from '../types';

export function detectBrowser() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Detect Chrome (including Chromium-based browsers like Brave, Edge, Opera)
  if (!!window.chrome) {
    return Browser.CHROME;
  }

  // Detect Safari
  if (window.safari || navigator.userAgent.toLowerCase().includes('safari')) {
    return Browser.SAFARI;
  }

  // Detect Firefox
  if (/Firefox/.test(userAgent)) {
    return 'Firefox';
  }

  // Detect Microsoft Edge (Chromium-based)
  if (/Edg/.test(userAgent)) {
    return Browser.EDGE;
  }

  // Detect Opera
  if (/OPR|Opera/.test(userAgent)) {
    return Browser.OPERA;
  }

  // Detect Internet Explorer
  if (/Trident/.test(userAgent)) {
    return Browser.INTERNET_EXPLORER;
  }

  // Default case if the browser is not recognized
  return Browser.UNKNOWN_BROWSER;
}

export function isIOS() {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
}

export function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
  } else {
    const input = document.createElement('input');
    input.style.display = 'none';
    document.appendChild(input);
    input.value = text;
    input.focus();
    input.select();
    document.execCommand('copy');
    document.removeChild(input);
  }
}
