import { parse } from "https://deno.land/std@0.120.0/flags/mod.ts";

const args = parse(Deno.args, {
	string: ["target", "url", "action"],
});

let link = "https://web.archive.org/";

switch (args.target) {
	case "Latest":
		link += `web/${args.url}`;
		break;
	case "Overview":
		link += `web/*/${args.url}`;
		break;
	case "Save":
		link += `save/${args.url}`;
		break;
}

if (args.action === "Output") {
	console.log(link);
	Deno.exit();
}

const aliases = {
	windows: ["cmd", "/c", "start"],
	darwin: ["open"],
	linux: ["sensible-browser"],
};

const process = Deno.run({
	cmd: [...aliases[Deno.build.os], new URL(link).toString()],
	stdin: "piped",
	stdout: "piped",
	stderr: "piped",
});

await Promise.all([
	process.status(),
	process.output(),
	process.stderrOutput(),
]);
