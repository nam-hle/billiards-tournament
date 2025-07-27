import { parse, format } from "date-fns";

export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		weekday: "short",
		...options
	});
};

export const formatTime = (timeString: string) => {
	const parsed = parse(timeString, "HH:mm", new Date());

	return format(parsed, "hh:mm a");
};
