import { parse } from "std/flags/mod.ts";

const args: {
	numerator: string;
	denominator: string;
	format: string;
} = parse(Deno.args, {
	string: ["numerator", "denominator", "format"],
});

const formatResult = ["f", "F", "Format"].includes(args.format);

function reduce(numerator: number, denominator: number) {
	let a = numerator;
	let b = denominator;
	let c;
	while (b) {
		c = a % b;
		a = b;
		b = c;
	}
	return [numerator / a, denominator / a];
}

const reduced = reduce(Number(args.numerator), Number(args.denominator));

if (formatResult) {
	console.log(
		`${reduced[0].toLocaleString("fullwide", {
			maximumSignificantDigits: 21,
		})}/${reduced[1].toLocaleString("fullwide", {
			maximumSignificantDigits: 21,
		})}`
	);
} else {
	console.log(`${reduced[0]}/${reduced[1]}`);
}

export {};
