import { parse } from "https://deno.land/std@0.120.0/flags/mod.ts";
import { parse as parseSnowflake } from "https://unpkg.com/discord-snowflake@2.0.0/dist/src/snowflake.js";

const args = parse(Deno.args, {
	string: [
		"year",
		"month",
		"day",
		"hour",
		"minute",
		"second",
		"snowflake",
		"format",
	],
});

const { year, month, day, hour, minute, second, snowflake } = args;
let { format } = args;

switch (format) {
	case "Relative":
		format = ":R";
		break;
	case "Long Date Time":
		format = ":F";
		break;
	case "Short Date Time":
		format = ":f";
		break;
	case "Long Date":
		format = ":D";
		break;
	case "Short Date":
		format = ":d";
		break;
	case "Long Time":
		format = ":T";
		break;
	case "Short Time":
		format = ":t";
		break;
}

if (snowflake) {
	console.log(
		`<t:${Math.floor(
			new Date(parseSnowflake(snowflake).timestamp).getTime() / 1000
		)}${format}>`
	);

	Deno.exit();
}

const time = new Date(
	`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(
		2,
		"0"
	)}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}.000Z`
);

console.log(
	`<t:${Math.floor(
		(time.getTime() + time.getTimezoneOffset() * 60 * 1000) / 1000
	)}${format}>`
);

export {};
