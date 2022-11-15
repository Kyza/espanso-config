import { parse } from "std/flags/mod.ts";
import { join } from "std/path/mod.ts";

const args: { name: string; location: string } = parse(Deno.args, {
	string: ["name", "location"],
});

const { name, location } = args;

try {
	console.log(Deno.readTextFileSync(join(location, "variables", `${name}`)));
} catch {
	// No need to output anything.
}
