import { parse } from "std/flags/mod.ts";

const args: { text: string } = parse(Deno.args, {
	string: ["text"],
});

console.log(args.text.replace(/(`|\*|_|>|<)/g, "\\$1"));

export {};
