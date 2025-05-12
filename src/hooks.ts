import React from "react";
import { usePathname } from "next/navigation";

import { trpc } from "@/services";

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

export function useAuthenticatingPage() {
	const pathName = usePathname();

	return pathName === "/signup" || pathName === "/login";
}

export function useBanks() {
	const { data: banks } = trpc.banks.get.useQuery();

	return React.useCallback((providerNumber: string) => banks?.find((bank) => bank.providerNumber === providerNumber), [banks]);
}
