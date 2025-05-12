import { cn } from "@/utils/cn";
import { type ClassName, type Container } from "@/types";

export const Heading = (props: Container & ClassName) => {
	return <h2 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", props.className)}>{props.children}</h2>;
};
