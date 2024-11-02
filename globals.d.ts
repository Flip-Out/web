export {};

declare global {
  interface Window {
    closeIframe: () => void;
    opera: string;
  }
}
