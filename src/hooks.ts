import React from "react";
import { usePathname } from "next/navigation";

export function useBoolean(initialValue: boolean | (() => boolean)) {
	const [value, setValue] = React.useState(initialValue);

	const toggleValue = React.useCallback(() => setValue((prevValue) => !prevValue), []);
	const setTrue = React.useCallback(() => setValue(true), []);
	const setFalse = React.useCallback(() => setValue(false), []);

	return React.useMemo(() => {
		return [value, { setTrue, setFalse, setValue, toggleValue }] as const;
	}, [setFalse, setTrue, toggleValue, value]);
}

export function useHomePage() {
	const pathName = usePathname();

	return pathName === "/";
}
