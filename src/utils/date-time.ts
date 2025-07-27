import { parse, format } from "date-fns";

import { DateTime } from "@/interfaces";

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

export const formatDateTime = (dateTime: DateTime) => {
	return DateTime.toDate(dateTime).toLocaleDateString("en-US", {
		hour12: false,
		month: "short",
		day: "numeric",
		hour: "2-digit",
		weekday: "short",
		minute: "2-digit"
	});
};
