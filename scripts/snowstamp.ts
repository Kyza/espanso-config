import { getTimestamp } from "discord-snowflake";
import { parse } from "std/flags/mod.ts";

const args: {
	year: string;
	month: string;
	day: string;
	hour: string;
	minute: string;
	second: string;
	snowflake: string;
	format: string;
	relative: boolean;
} = parse(Deno.args, {
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
	boolean: ["relative"],
});

const { year, month, day, hour, minute, second, snowflake, relative } = args;
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
			new Date(getTimestamp(snowflake)).getTime() / 1000
		)}${format}>`
	);

	Deno.exit();
}

if (relative) {
	const time = new Date();

	time.setFullYear(time.getFullYear() + parseInt(year));
	time.setMonth(time.getMonth() + parseInt(month));
	time.setDate(time.getDate() + parseInt(day));

	time.setHours(time.getHours() + parseInt(hour));
	time.setMinutes(time.getMinutes() + parseInt(minute));
	time.setSeconds(time.getSeconds() + parseInt(second));

	console.log(`<t:${Math.floor(time.getTime() / 1000)}${format}>`);
} else {
	const time = new Date(
		`${year}-${month.padStart(2, "0")}-${day.padStart(
			2,
			"0"
		)}T${hour.padStart(2, "0")}:${minute.padStart(
			2,
			"0"
		)}:${second.padStart(2, "0")}.000Z`
	);

	console.log(
		`<t:${Math.floor(
			(time.getTime() + time.getTimezoneOffset() * 60 * 1000) / 1000
		)}${format}>`
	);
}

export {};
