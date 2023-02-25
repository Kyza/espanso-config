import { join } from "std/path/mod.ts";

const __dirname = new URL(".", import.meta.url).pathname.substring(1);

export default async function getWASM(url: string) {
	const wasmName = url.split("/")[url.split("/").length - 1];
	const wasmPath = join(__dirname, wasmName);
	try {
		return await Deno.readFile(wasmPath);
	} catch {
		const wasm = await fetch(url).then((res) => res.arrayBuffer());
		Deno.writeFile(wasmPath, new Uint8Array(wasm));
		return wasm;
	}
}
