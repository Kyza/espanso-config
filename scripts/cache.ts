import getFiles from "getfiles";
import { parse } from "std/flags/mod.ts";
import { toWords } from "written-numbers";

const args: { confirm: string; location: string } = parse(Deno.args, {
	string: ["confirm", "location"],
});

if (/(YES|Y)/i.test(args.confirm)) {
	const scripts = getFiles({
		root: args.location,
		exclude: [".git"],
	}).filter((file) => file.name.endsWith(".ts"));

	for (const file of scripts) {
		const process = Deno.run({
			cmd: ["deno", "cache", "--reload", file.realPath, "--unstable"],
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

	console.log(`Reloaded the caches of ${toWords(scripts.length)} scripts.`);
}
