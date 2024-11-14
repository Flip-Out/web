export {};

declare global {
  interface Window {
    closeIframe: () => void;
    opera: string;
    safari: any;
    chrome: any;
  }
}
