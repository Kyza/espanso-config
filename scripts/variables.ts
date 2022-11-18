import * as TOML from "std/encoding/toml.ts";
import { parse } from "std/flags/mod.ts";
import { ensureFileSync } from "std/fs/mod.ts";
import { dirname, fromFileUrl, join } from "std/path/mod.ts";

const args: {
	variable: string;
	value: string | undefined;
	location: string;
	raw: boolean;
	all: boolean;
} = parse(Deno.args, {
	string: ["variable", "value", "location"],
	boolean: ["raw", "all"],
});

const { variable, value, raw } = args;
const kyzaConfigLocation = join(dirname(fromFileUrl(import.meta.url)), "..");

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

const variablesFile = join(kyzaConfigLocation, "variables.toml");
ensureFileSync(variablesFile);
const file = Deno.readTextFileSync(variablesFile);
const config = file.length === 0 ? {} : TOML.parse(file);

function objectPaths(obj: object, path = ""): string[] {
	return Object.entries(obj).reduce((acc, [key, value]) => {
		const childPath = path.length === 0 ? key : `${path}.${key}`;
		acc.push(childPath);
		if (typeof value === "object" && !Array.isArray(value)) {
			acc.push(...objectPaths(value, childPath));
		}
		return acc;
	}, [] as string[]);
}
export function getAllVariableNames() {
	return objectPaths(config).join("\n");
}
export function getVariable(path: PropertyKey[]) {
	return get(config, path);
}
export function setVariable(path: PropertyKey[], value: any) {
	// Set the value.
	try {
		set(config, path, value);
	} catch (e) {
		console.error("You possibly entered an invalid value.", e);
	}

	Deno.writeTextFileSync(variablesFile, TOML.stringify(config), {
		create: true,
	});
}

if (args.all) {
	console.log(getAllVariableNames());
} else if ("variable" in args) {
	try {
		if ("value" in args) {
			setVariable(variable.split("."), JSON.parse(value as string));
		} else if (has(config, variable.split("."))) {
			const result = getVariable(variable.split("."));

			if (raw) {
				console.log(JSON.stringify(result, null, "\t"));
			} else {
				switch (typeof result) {
					case "object":
						if (Array.isArray(result)) console.log(result.join("\n"));
						break;
					default:
						console.log(result);
						break;
				}
			}
		}
	} catch (e) {
		console.error(e);
	}
}
