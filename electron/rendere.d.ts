export {}; // make this file as module to access notifications

declare global {
  interface Window {
    notification: {
      chat: (options: { title: string; body: string }) => void;
    };
  }
}
