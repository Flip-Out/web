import { Browser } from '../types';

export function detectBrowser() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Detect Chrome (including Chromium-based browsers like Brave, Edge, Opera)
  if (!!window.chrome) {
    return Browser.CHROME;
  }

  // Detect Safari
  if (window.safari) {
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
