import bigDecimal from "js-big-decimal";
import crypto from "node:crypto";

const diceNotation = /(?<amount>\d+)?d(?<sides>\d+|%)/gi;

function roll(amount: number, sides: number | "%"): number {
	if (sides === 1) return amount;
	if (sides === "%") sides = 100;

	let result = 0;

	while (amount > 0) {
		result += crypto.randomInt(1, sides);
		amount--;
	}

	return result;
}

let expr = process.argv[process.argv.findIndex((arg) => arg === "--") + 1];
const AsyncFunction = async function () {}.constructor;

// If the expression ends with "f", format the result.
let formatResult = false;
if (expr.endsWith("f")) {
	formatResult = true;
	expr = expr.slice(0, -1);
}

try {
	// Replace dice notation.
	let matches;
	while ((matches = diceNotation.exec(expr))) {
		const rolled = roll(
			matches.groups.amount ?? 1,
			matches.groups.sides === "%" ? "%" : parseInt(matches.groups.sides)
		);
		expr = expr.replace(matches[0], rolled.toString());
	}

	const result = await AsyncFunction(
		"bd",
		"m",
		"crypto",
		`return ${expr}`
	)(bigDecimal, Math, crypto);

	switch (typeof result) {
		case "number":
			console.log(formatResult ? result.toLocaleString() : result);
			break;
		case "bigint":
			console.log(
				formatResult
					? result.toLocaleString()
					: // Remove the n at the end.
					  result.toString().slice(0, -1)
			);
			break;
		case "string":
			console.log(result);
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
		? JSON.stringify(process.argv, null, "\t")
		: JSON.stringify(process.argv);
	console.log(e);
}

export {};
