declare module 'nimbus-ui-server' {
  export function serveUi(nimbusLocalStoragePath: string): Promise<void>;
}
