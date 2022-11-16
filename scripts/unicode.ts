import { parse } from "std/flags/mod.ts";

const args: { input: string; action: string } = parse(Deno.args, {
	string: ["input", "action"],
});

if (args.action === "To Unicode") {
	console.log(String.fromCharCode(Number(`0x${args.input}`)));
} else {
	console.log(args.input.charCodeAt(0).toString(16));
}
