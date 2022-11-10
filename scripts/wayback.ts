import { parse } from "https://deno.land/std@0.120.0/flags/mod.ts";

const args = parse(Deno.args, {
	string: ["target", "url"],
});

switch (args.target) {
	case "Latest":
		console.log(`web/*/${args.url}`);
		break;
	case "Overview":
		console.log(`web/${args.url}`);
		break;
	case "Save":
		console.log(`save/${args.url}`);
		break;
}
