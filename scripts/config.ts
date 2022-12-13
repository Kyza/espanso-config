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
				action = [
					"powershell",
					"-WindowStyle",
					"Hidden",
					"Start-Process",
					"-NoNewWindow",
					"-FilePath",
					"explorer.exe",
					"-WorkingDirectory",
					args.target,
				];
				break;
			case "darwin":
				action = ["open", args.target];
				break;
			case "linux":
				action = ["xdg-open", args.target];
				break;
		}
		break;
	case "Visual Studio Code":
		action = [
			"powershell",
			"-WindowStyle",
			"Hidden",
			"Start-Process",
			"-NoNewWindow",
			"-FilePath",
			"code",
			"-ArgumentList",
			args.target,
		];
		break;
	default:
		action = ["xdg-open", args.target];
}

try {
	const process = Deno.run({
		cmd: action,
		stdin: "piped",
		stdout: "piped",
		stderr: "piped",
	});

	await Promise.all([
		process.status(),
		process.output(),
		process.stderrOutput(),
	]);
} catch (err) {
	console.log(err);
}
