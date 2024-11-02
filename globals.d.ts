export {};

declare global {
  interface Window {
    closeIframe: () => void;
  }
}
