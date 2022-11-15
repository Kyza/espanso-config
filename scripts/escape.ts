import { parse } from "https://deno.land/std@0.120.0/flags/mod.ts";

const args = parse(Deno.args, {
	string: ["text"],
});

console.log(args.text.replace(/(`|\*|_|>|<)/g, "\\$1"));

export {};
