import { parse } from "https://deno.land/std@0.120.0/flags/mod.ts";

const args = parse(Deno.args, {
	string: ["id"],
});

console.log(String.fromCharCode(Number(`0x${args.id}`)));
