import { parse } from "std/flags/mod.ts";

const args: { list: string } = parse(Deno.args, {
	string: ["list"],
});

console.log(args.list.replace(/\n/g, " $ "));

export {};
