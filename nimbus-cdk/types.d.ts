// Type declarations for Node.js built-in modules
declare module 'fs' {
  export function existsSync(path: string): boolean;
  export function readFileSync(path: string, options: { encoding: string; flag?: string; } | string): string;
  export function readFileSync(path: string, options?: { encoding?: null; flag?: string; } | null): Buffer;
  export function writeFileSync(path: string, data: string | Buffer, options?: { encoding?: string; mode?: number; flag?: string; } | string): void;
  export function mkdirSync(path: string, options?: { recursive?: boolean; mode?: number; } | number): void;
}

declare module 'path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
  export function dirname(path: string): string;
  export function basename(path: string, ext?: string): string;
  export function extname(path: string): string;
  export function isAbsolute(path: string): boolean;
}

// Global variables
declare const __dirname: string;
declare const __filename: string;

// Process global
declare namespace NodeJS {
  interface Process {
    cwd(): string;
    env: Record<string, string>;
  }
}

declare const process: NodeJS.Process;
