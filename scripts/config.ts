import { parse } from "std/flags/mod.ts";

const args: { target: string; url: string; action: string } = parse(
	Deno.args,
	{
		string: ["target", "action"],
	}
);

let action;
switch (args.action) {
	case "File Explorer":
		switch (Deno.build.os) {
			case "windows":
				action = "explorer.exe";
				break;
			case "darwin":
				action = "open";
				break;
			case "linux":
				action = "xdg-open";
				break;
		}
		break;
	case "Visual Studio Code":
		action = "code";
		break;
	default:
		action = "xdg-open";
}

const process = Deno.run({
	cmd: [action, args.target],
	stdin: "piped",
	stdout: "piped",
	stderr: "piped",
});

await Promise.all([
	process.status(),
	process.output(),
	process.stderrOutput(),
]);
