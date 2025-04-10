declare module 'nimbus-ui-server' {
  export function serveUi(nimbusLocalStoragePath: string): Promise<void>;
}

declare module 'path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
  export function dirname(path: string): string;
  export function basename(path: string, ext?: string): string;
  export function extname(path: string): string;
  export function isAbsolute(path: string): boolean;
  export function parse(path: string): { root: string; dir: string; base: string; ext: string; name: string; };
  export default {
    join,
    resolve,
    dirname,
    basename,
    extname,
    isAbsolute,
    parse
  };
}

declare module 'url' {
  export function fileURLToPath(url: string | URL): string;
  export function pathToFileURL(path: string): URL;
  export function format(urlObject: URL): string;
  export function parse(urlString: string): URL;
}

declare module 'path/posix' {
  export interface PlatformPath {
    join(...paths: string[]): string;
    resolve(...paths: string[]): string;
    dirname(path: string): string;
    basename(path: string, ext?: string): string;
    extname(path: string): string;
    isAbsolute(path: string): boolean;
    parse(path: string): { root: string; dir: string; base: string; ext: string; name: string; };
  }
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
  export function dirname(path: string): string;
  export function basename(path: string, ext?: string): string;
  export function extname(path: string): string;
  export function isAbsolute(path: string): boolean;
  export function parse(path: string): { root: string; dir: string; base: string; ext: string; name: string; };
  export default {
    join,
    resolve,
    dirname,
    basename,
    extname,
    isAbsolute,
    parse
  };
}

declare module 'fs' {
  export interface Dirent {
    name: string;
    isFile(): boolean;
    isDirectory(): boolean;
    isBlockDevice(): boolean;
    isCharacterDevice(): boolean;
    isSymbolicLink(): boolean;
    isFIFO(): boolean;
    isSocket(): boolean;
  }
  
  export function existsSync(path: string): boolean;
  export function readFileSync(path: string, options: { encoding: string; flag?: string; } | string): string;
  export function readFileSync(path: string, options?: { encoding?: null; flag?: string; } | null): Buffer;
  export function writeFileSync(path: string, data: string | Buffer, options?: { encoding?: string; mode?: number; flag?: string; } | string): void;
  export function mkdirSync(path: string, options?: { recursive?: boolean; mode?: number; } | number): void;
  export function rmSync(path: string, options?: { recursive?: boolean; force?: boolean; }): void;
  export function readdirSync(path: string): string[];
  export function readdirSync(path: string, options: { withFileTypes: true; encoding?: string; }): Dirent[];
  export function statSync(path: string): { isDirectory(): boolean; size: number; };
  export function copyFileSync(src: string, dest: string): void;
  export function cpSync(source: string, destination: string, options?: { recursive?: boolean; }): void;
  
  export default {
    existsSync,
    readFileSync,
    writeFileSync,
    mkdirSync,
    rmSync,
    readdirSync,
    statSync,
    copyFileSync,
    cpSync
  };
}

declare module 'os' {
  export function tmpdir(): string;
  export function homedir(): string;
  export default {
    tmpdir,
    homedir
  };
}

declare module 'child_process' {
  export interface ExecOptions {
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    encoding?: string;
    shell?: string;
    timeout?: number;
    maxBuffer?: number;
    killSignal?: string | number;
    uid?: number;
    gid?: number;
    windowsHide?: boolean;
  }
  export interface ExecException extends Error {
    cmd?: string;
    killed?: boolean;
    code?: number;
    signal?: string;
  }
  export interface ExecResult {
    stdout: string;
    stderr: string;
  }
  export function exec(command: string, options?: ExecOptions): void;
  export function exec(command: string, callback: (error: ExecException | null, stdout: string, stderr: string) => void): void;
  export function exec(command: string, options: ExecOptions, callback: (error: ExecException | null, stdout: string, stderr: string) => void): void;
}

declare module 'util' {
  export function promisify<T extends (...args: any[]) => any>(fn: T): T extends (arg1: infer A1, arg2: infer A2, arg3: infer A3, callback: (...args: any[]) => any) => any
    ? (arg1: A1, arg2: A2) => Promise<{ stdout: string; stderr: string }>
    : (...args: Parameters<T>) => Promise<any>;
}

declare namespace NodeJS {
  interface Process {
    cwd(): string;
    exit(code?: number): never;
    argv: string[];
    once(event: string, listener: (...args: any[]) => void): void;
  }
  
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
  
  interface ErrnoException extends Error {
    errno?: number;
    code?: string;
    path?: string;
    syscall?: string;
  }
}

declare const process: NodeJS.Process;
declare const require: NodeRequire;
declare const module: NodeModule;

interface NodeRequire {
  (id: string): any;
  resolve(id: string): string;
  cache: { [id: string]: NodeModule };
  extensions: { [ext: string]: (m: NodeModule, filename: string) => any };
  main: NodeModule | undefined;
}

interface NodeModule {
  exports: any;
  require: NodeRequire;
  id: string;
  filename: string;
  loaded: boolean;
  parent: NodeModule | null;
  children: NodeModule[];
  paths: string[];
}

interface Window {
  setTimeout(callback: (...args: any[]) => void, ms: number): number;
}

declare function setTimeout(callback: (...args: any[]) => void, ms: number): number;
