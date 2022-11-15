import { parse } from "https://deno.land/std@0.164.0/flags/mod.ts";
import * as vegas from "https://deno.land/x/vegas@v1.3.0/mod.ts";
import { toOrdinal, toWords } from "https://esm.sh/written-numbers";
import * as bigDecimal from "https://unpkg.com/js-big-decimal@1.3.1/dist/web/js-big-decimal.min.js";

const diceNotation = /(?<amount>\d+)?d(?<sides>\d+|%)/i;

function roll(amount: number, sides: number | "%"): number {
	if (sides === 1) return amount;
	if (sides === "%") sides = 100;

	let result = 0;

	while (amount > 0) {
		result += vegas.randomInt(1, sides + 1);
		amount--;
	}

	return result;
}

function replaceLast(str: string, target: string, replacement: string) {
	const index = str.lastIndexOf(target);
	if (index >= 0 && index + target.length >= str.length) {
		str = str.substring(0, index) + replacement;
	}
	return str;
}

function propagateCase(input: string, output: string): string {
	if (input[0].toUpperCase() === input[0]) {
		return output && output[0].toUpperCase() + output.slice(1);
	}
	return output;
}

const args: {
	expr: string;
	format: string;
	case: string;
} = parse(Deno.args, {
	string: ["expr", "format", "case"],
});

const formatResult = ["f", "F", "Format"].includes(args.format);
let expr = args.expr;
const AsyncFunction = async function () {}.constructor;

try {
	// Replace dice notation.
	let matches;
	while ((matches = diceNotation.exec(expr))) {
		const rolled = roll(
			parseInt(matches.groups?.amount ?? "1"),
			matches.groups?.sides === "%"
				? "%"
				: parseInt(matches.groups?.sides ?? "1")
		);
		expr = expr.replace(matches[0], rolled.toString());
	}

	// Try to implicit return the last expression.
	// Trim and remove ending if it's a semicolon.
	expr = expr.trim();
	if (expr.endsWith(";")) expr = expr.slice(0, -1);
	const lastBreakIndex = Math.max(
		expr.lastIndexOf(";"),
		expr.lastIndexOf("}") // Catch loops.
	);
	let lastExpr = "";
	if (lastBreakIndex > -1) {
		// It was multiline.
		lastExpr = expr.slice(lastBreakIndex + 1);
		expr = expr.slice(0, lastBreakIndex + 1);
	} else {
		// It was a single line.
		lastExpr = expr;
		expr = "";
	}

	const result = await AsyncFunction(
		"bd",
		"m",
		"crypto",
		"vegas",
		"toWords",
		"toOrdinal",
		"propagateCase",
		`${expr};return ${lastExpr.trim()};`
	)(bigDecimal, Math, crypto, vegas, toWords, toOrdinal, propagateCase);

	switch (typeof result) {
		case "number":
			console.log(
				formatResult
					? result.toLocaleString("fullwide", {
							maximumSignificantDigits: 21,
					  })
					: result
			);
			break;
		case "bigint":
			console.log(
				formatResult
					? result.toLocaleString()
					: // Remove the n at the end.
					  replaceLast(result.toString(), "n", "")
			);
			break;
		case "string":
			console.log(propagateCase(args.case, result));
			break;
		default:
			console.log(
				formatResult
					? JSON.stringify(result, null, "\t")
					: JSON.stringify(result)
			);
			break;
	}
} catch (e) {
	console.log(expr);
	formatResult
		? JSON.stringify(Deno.args, null, "\t")
		: JSON.stringify(Deno.args);
	console.log(e);
}

export {};
