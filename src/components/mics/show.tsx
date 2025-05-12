import React, { type JSX, isValidElement } from "react";

namespace Show {
	export interface Props<T> {
		/**
		 * If `true`, it'll render the `children` prop
		 */
		when: T | null | undefined;
		/**
		 * The fallback content to render if `when` is `false`
		 */
		fallback?: React.ReactNode;
		/**
		 * The children to render if `when` is `true`
		 */
		children: React.ReactNode | ((props: T) => React.ReactNode);
	}
}

export function Show<T>(props: Show.Props<T>): JSX.Element {
	const { when, fallback, children } = props;
	let result: React.ReactNode;

	if (when === null || when === undefined) {
		result = fallback;
	} else {
		result = typeof children === "function" ? children(when) : children;
	}

	return isValidElement(result) ? result : <>{result}</>;
}
