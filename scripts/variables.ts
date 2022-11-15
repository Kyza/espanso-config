import * as TOML from "std/encoding/toml.ts";
import { parse } from "std/flags/mod.ts";
import { ensureFileSync } from "std/fs/mod.ts";
import { join } from "std/path/mod.ts";

const args: {
	variable: string;
	value: string | undefined;
	location: string;
	raw: boolean;
} = parse(Deno.args, {
	string: ["variable", "value", "location"],
	boolean: ["raw"],
});

const { variable, value, location, raw } = args;

// A function that recursively gets a variable from an object.
function get(obj: any, path: PropertyKey[]): unknown {
	let current = obj;
	for (let i = 0; i < path.length; i++) {
		if (!Object.hasOwn(current, path[i])) return;
		current = current[path[i]];
	}
	return current;
}
function has(obj: any, path: PropertyKey[]): unknown {
	let current = obj;
	for (let i = 0; i < path.length; i++) {
		if (!Object.hasOwn(current, path[i])) return false;
		current = current[path[i]];
	}
	return true;
}
function set<Value>(obj: any, path: PropertyKey[], value: Value): Value {
	let current = obj;
	for (let i = 0; i < path.length - 1; i++) {
		if (current[path[i]] == null) current[path[i]] = {};
		current = current[path[i]];
	}
	current[path[path.length - 1]] = value;
	return value;
}

try {
	ensureFileSync(join(location, "variables.toml"));
	const file = Deno.readTextFileSync(join(location, "variables.toml"));
	const config = file.length === 0 ? {} : TOML.parse(file);

	if (Object.hasOwn(args, "value")) {
		// Set the value.
		try {
			set(config, variable.split("."), JSON.parse(value as string));
		} catch (e) {
			console.error("You possibly entered an invalid value.", e);
		}

		Deno.writeTextFileSync(
			join(location, "variables.toml"),
			TOML.stringify(config),
			{
				create: true,
			}
		);
	} else if (has(config, variable.split("."))) {
		const result = get(config, variable.split("."));

		if (raw) {
			console.log(result);
		} else {
			switch (typeof result) {
				case "object":
					if (Array.isArray(result))
						console.log(JSON.stringify(result.join("\n"), null, "\t"));
					break;
				default:
					console.log(JSON.stringify(result, null, "\t"));
					break;
			}
		}
	}
} catch (e) {
	console.error(e);
}
