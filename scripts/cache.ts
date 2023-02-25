import getFiles from "getfiles";
import { parse } from "std/flags/mod.ts";
import { dirname, fromFileUrl, join } from "std/path/mod.ts";
import initWrittenNumbers, { toWords } from "written-numbers";
import getWASM from "./getWASM.ts";

const args: { confirm: string; location: string } = parse(Deno.args, {
	string: ["confirm"],
});

const kyzaConfigLocation = join(dirname(fromFileUrl(import.meta.url)), "..");

if (/(YES|Y)/i.test(args.confirm)) {
	const scripts = getFiles({
		root: kyzaConfigLocation,
		exclude: [".git"],
	}).filter((file) => file.name.endsWith(".ts"));

	for (const file of scripts) {
		const process = Deno.run({
			cmd: ["deno", "cache", "--reload", file.realPath, "--unstable"],
			cwd: kyzaConfigLocation,
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

	await initWrittenNumbers(
		await getWASM(
			"https://esm.sh/written-numbers@1.0.6/dist/wasm/written_numbers_wasm_bg.wasm"
		)
	);

	console.log(
		`Reloaded the caches of ${toWords({ number: scripts.length })} scripts.`
	);
}
