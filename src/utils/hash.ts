import objectHash from "object-hash";

export function hashObject(object: object): string {
	return objectHash(object, { encoding: "hex", algorithm: "sha256", unorderedArrays: true, unorderedObjects: true });
}
