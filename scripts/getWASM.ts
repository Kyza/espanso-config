import { join } from "std/path/mod.ts";

const __dirname = new URL(".", import.meta.url).pathname.substring(1);

export default async function getWASM(url: string, version: string) {
	const wasmName = url.split("/")[url.split("/").length - 1].split(".")[0];
	const wasmPath = join(__dirname, `${wasmName}@${version}.wasm`);
	try {
		return await Deno.readFile(wasmPath);
	} catch {
		const wasm = await fetch(url).then((res) => res.arrayBuffer());
		Deno.writeFile(wasmPath, new Uint8Array(wasm));
		return wasm;
	}
}
