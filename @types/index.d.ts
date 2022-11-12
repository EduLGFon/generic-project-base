// deno-lint-ignore-file no-explicit-any

/* Primitives */
interface Number {
    toMB(): string;
}

interface String {
    toPascalCase(): string;
    toSector(): string;
}

interface Window {
    postMessage(...msg: any): void;
    onmessage(e: MessageEvent): void | undefined;
}

interface Postgres {
    connect(): void;
    end(): void;
    ready: boolean;
}

interface Services {
    pg: Postgres;
}

type threadFiles = 'POSTGRES';
type threadNames = 'pg';