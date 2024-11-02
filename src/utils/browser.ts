export function detectBrowser() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  console.log('userAgent', userAgent);

  // Detect Telegram in-app browser
  if (userAgent.includes('Telegram')) {
    return 'Telegram Browser';
  }

  // Detect Chrome (including Chromium-based browsers like Brave, Edge, Opera)
  if (/Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor)) {
    return 'Chrome';
  }

  // Detect Safari
  if (/Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor)) {
    return 'Safari';
  }

  // Detect Firefox
  if (/Firefox/.test(userAgent)) {
    return 'Firefox';
  }

  // Detect Microsoft Edge (Chromium-based)
  if (/Edg/.test(userAgent)) {
    return 'Edge';
  }

  // Detect Opera
  if (/OPR|Opera/.test(userAgent)) {
    return 'Opera';
  }

  // Detect Internet Explorer
  if (/Trident/.test(userAgent)) {
    return 'Internet Explorer';
  }

  // Default case if the browser is not recognized
  return 'Unknown Browser';
}
