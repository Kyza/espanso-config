import { parse } from "std/flags/mod.ts";

const args: { id: string } = parse(Deno.args, {
	string: ["id"],
});

console.log(String.fromCharCode(Number(`0x${args.id}`)));
