import bigDecimal from "js-big-decimal";

const expr = process.argv[process.argv.findIndex((arg) => arg === "--") + 1];
const AsyncFunction = async function () {}.constructor;

try {
	const result = await AsyncFunction("bd", `return ${expr}`)(bigDecimal);
	switch (typeof result) {
		case "bigint":
			// Remove the n at the end.
			console.log(result.toString().slice(0, -1));
			break;
		case "string":
			console.log(result);
			break;
		default:
			console.log(JSON.stringify(result, null, "\t"));
			break;
	}
} catch (e) {
	console.log(expr);
	console.log(JSON.stringify(process.argv, null, "\t"));
	console.log(e);
}

export {};
