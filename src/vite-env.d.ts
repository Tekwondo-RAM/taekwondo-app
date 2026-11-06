/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface AppConfig {
  baseURL: string;
}

declare global {
  interface Window {
    __APP_CONFIG__?: AppConfig;
  }
}

export {};
