import { parse } from "std/flags/mod.ts";
import { join } from "std/path/mod.ts";

const args: { target: string; url: string; action: string } = parse(
	Deno.args,
	{
		string: ["target", "action"],
	}
);

async function makeFreeName(dir: string): Promise<string> {
	let name = "";
	const takenNames: string[] = [];
	for await (const dirEntry of Deno.readDir(dir)) {
		takenNames.push(dirEntry.name);
	}
	do {
		name = `${Math.random().toString(36).substring(2, 15)}.yml`;
	} while (takenNames.includes(name));
	return name;
}

let action;
switch (args.action) {
	case "Reload": {
		const temp = join(
			args.target,
			"match",
			await makeFreeName(args.target)
		);
		Deno.writeTextFileSync(temp, "");
		Deno.removeSync(temp);
		Deno.exit();
		break;
	}
	case "File Explorer":
		switch (Deno.build.os) {
			case "windows":
				// Start with CMD because starting with Start-Process causes explorer.exe to constantly use a ton of CPU.
				action = ["cmd", "/c", "start", args.target];
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
		switch (Deno.build.os) {
			case "windows":
				// Start with PowerShell because starting with CMD causes Deno to never exit.
				action = [
					"powershell",
					"Start-Process",
					"-NoNewWindow",
					"-FilePath",
					"code",
					"-ArgumentList",
					args.target,
				];
				break;
			default:
				action = ["code", args.target];
				break;
		}
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
