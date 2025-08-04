import { type BaseMatch } from "@/interfaces";

export function isArray<T extends BaseMatch>(array: BaseMatch[], typeGuard: (item: BaseMatch) => item is T): array is T[] {
	return Array.isArray(array) && array.every(typeGuard);
}
