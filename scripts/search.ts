import { parse } from "std/flags/mod.ts";

const args: { query: string } = parse(Deno.args, {
	string: ["query"],
});

const aliases = {
	windows: ["cmd", "/c", "start"],
	darwin: ["open"],
	linux: ["sensible-browser"],
};

const process = Deno.run({
	cmd: [
		...aliases[Deno.build.os],
		`https://duckduckgo.com/?q=${encodeURIComponent(args.query)}`,
	],
	stdin: "piped",
	stdout: "piped",
	stderr: "piped",
});

await Promise.all([
	process.status(),
	process.output(),
	process.stderrOutput(),
]);
