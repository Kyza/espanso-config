import { parse } from "https://deno.land/std@0.120.0/flags/mod.ts";

const args = parse(Deno.args, {
	string: ["confirm", "location"],
});

if (/(YES|Y)/i.test(args.confirm)) {
	const p = Deno.run({
		cmd: ["git", "pull"],
		cwd: args.location,
		stdin: "piped",
		stdout: "piped",
		stderr: "piped",
	});

	const { code } = await p.status();

	const rawOutput = await p.output();
	const rawError = await p.stderrOutput();

	if (code === 0) {
		await Deno.stdout.write(rawOutput);
	} else {
		const errorString = new TextDecoder().decode(rawError);
		console.log(errorString);
	}
}
