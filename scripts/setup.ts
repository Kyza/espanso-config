import { parse } from "std/flags/mod.ts";
import { dirname, fromFileUrl, join, resolve } from "std/path/mod.ts";

const args: { location: string } = parse(Deno.args, {
	string: ["location"],
});

const kyzaConfigLocation = join(dirname(fromFileUrl(import.meta.url)), "..");
const espansoConfigLocation = resolve(args.location);

const kyzaMatch = join(kyzaConfigLocation, "match");
const kyzaConfig = join(kyzaConfigLocation, "config");

const espansoMatchKyza = join(espansoConfigLocation, "match", "kyza");
const espansoConfigKyza = join(espansoConfigLocation, "config", "kyza");

// Git moment.
// Set the repo as a safe directory.
const process = Deno.run({
	cmd: [
		"git",
		"config",
		"--global",
		"--add",
		"safe.directory",
		kyzaConfigLocation,
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

// Try to remove any existing symlinks.
try {
	if ((await Deno.stat(espansoMatchKyza)).isSymlink) {
		await Deno.remove(espansoMatchKyza);
	}
} catch {}
try {
	if ((await Deno.stat(espansoConfigKyza)).isSymlink) {
		await Deno.remove(espansoConfigKyza);
	}
} catch {}

// Try to symlink the two directories.
try {
	await Deno.symlink(kyzaMatch, espansoMatchKyza, { type: "dir" });
} catch (e) {
	console.error(
		`Something likely already exists at "${espansoMatchKyza}". If so, please delete it manually.`
	);
	console.error(e);
	Deno.exit();
}
try {
	await Deno.symlink(kyzaConfig, espansoConfigKyza, { type: "dir" });
} catch (e) {
	console.error(
		`Something likely already exists at "${espansoConfigKyza}". If so, please delete it manually.`
	);
	console.error(e);
	Deno.exit();
}
