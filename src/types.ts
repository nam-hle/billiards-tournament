import type React from "react";

import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants";

export interface Container {
	children: React.ReactNode;
}

export interface ClassName {
	className?: string;
}

export interface Identifiable {
	readonly id: string;
}

export interface Linkable {
	readonly href?: string;
}

export interface Pagination {
	readonly pageSize: number;
	/** 1-based */
	readonly pageNumber: number;
}
export namespace Pagination {
	export function getDefault(): Pagination {
		return { pageSize: DEFAULT_PAGE_SIZE, pageNumber: DEFAULT_PAGE_NUMBER };
	}

	export function toRange(pagination: Pagination): [number, number] {
		const start = (pagination.pageNumber - 1) * pagination.pageSize;
		const end = start + pagination.pageSize - 1;

		return [start, end];
	}
}
