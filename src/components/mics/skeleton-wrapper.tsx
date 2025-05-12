import React from "react";

import { type Container } from "@/types";

namespace SkeletonWrapper {
	export interface Props extends Container {
		readonly loading: boolean;
		readonly skeleton: React.ReactNode;
	}
}

export const SkeletonWrapper: React.FC<SkeletonWrapper.Props> = (props) => {
	if (props.loading) {
		return <>{props.skeleton}</>;
	}

	return <>{props.children}</>;
};
