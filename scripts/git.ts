import { parse } from "std/flags/mod.ts";

function tryURL(url: string): false | URL {
	try {
		return new URL(url);
	} catch {
		return false;
	}
}

const args: { base: string; url: string; action: string } = parse(Deno.args, {
	string: ["base", "url", "action"],
});

const { base, url, action } = args;

const [user, repo] = args.url.split("/");

const link = tryURL(url)
	? url
	: `${base.endsWith("/") ? base : `${base}/`}${user}${
			repo != null ? `/${repo}` : ""
	  }`;

switch (action) {
	case "Output":
		console.log(link);
		break;
	case "Clone":
		console.log(`git clone ${link}`);
		break;
	case "Open": {
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
		break;
	}
}
