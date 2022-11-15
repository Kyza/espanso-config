import { parse } from "std/flags/mod.ts";

const args: { confirm: string; location: string } = parse(Deno.args, {
	string: ["confirm", "location"],
});

if (/(YES|Y)/i.test(args.confirm)) {
	const process = Deno.run({
		cmd: ["git", "pull"],
		cwd: args.location,
		stdin: "piped",
		stdout: "piped",
		stderr: "piped",
	});

	const { code } = await process.status();

	const rawOutput = await process.output();
	const rawError = await process.stderrOutput();

	if (code === 0) {
		console.log(new TextDecoder().decode(rawOutput));
	} else {
		const errorString = new TextDecoder().decode(rawError);
		console.log(errorString);
	}
}
