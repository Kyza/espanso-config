import { parse } from "https://deno.land/std@0.164.0/flags/mod.ts";

const args: { id: string } = parse(Deno.args, {
	string: ["id"],
});

console.log(String.fromCharCode(Number(`0x${args.id}`)));
