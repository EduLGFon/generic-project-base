/* Primitives */
interface Number {
	toMB(): string;
}

interface String {
	toPascalCase(): string;
	toCSS: string;
}

type str = string;
type int = number;
type float = number;
type double = number;
type tuple<T> = Array<T>;
