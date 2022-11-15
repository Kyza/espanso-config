import { parse } from "https://deno.land/std@0.164.0/flags/mod.ts";

const args: { text: string } = parse(Deno.args, {
	string: ["text"],
});

console.log(args.text.replace(/(`|\*|_|>|<)/g, "\\$1"));

export {};
