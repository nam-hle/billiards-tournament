import { format, isToday, isThisWeek, isYesterday, formatDistanceToNow, differenceInCalendarDays } from "date-fns";

export function noop() {}

export const CLIENT_DATE_FORMAT = "dd/MM/yy";
export const SERVER_DATE_FORMAT = "yyyy-MM-dd";

export function formatTime(time: string | undefined | null) {
	if (time === undefined || time === null) {
		return "";
	}

	return format(new Date(time), "PPp");
}

export function displayDateAsTitle(date: string | undefined | null) {
	if (date === undefined || date === null) {
		return "";
	}

	return format(date, "MMMM dd, yyyy");
}

export function displayDate(date: string | undefined | null) {
	if (date === undefined || date === null) {
		return "";
	}

	const daysDifference = differenceInCalendarDays(new Date(), date);

	if (isToday(date)) {
		return "Today";
	} else if (isYesterday(date)) {
		return "Yesterday";
	} else if (isThisWeek(date)) {
		return `This ${format(date, "EEEE")}`;
	} else if (daysDifference < 30) {
		return `${daysDifference} days ago`;
	} else {
		return capitalize(formatDistanceToNow(date, { addSuffix: true }));
	}
}

export function formatDistanceTime(time: string | undefined | null) {
	if (time === undefined || time === null) {
		return "";
	}

	return formatDistanceToNow(new Date(time), { addSuffix: true });
}

export function capitalize(text: string) {
	return text[0].toUpperCase() + text.slice(1);
}

export function convertVerb(verb: string) {
	let pastTense;

	if (verb.endsWith("e")) {
		pastTense = verb + "d";
	} else if (/[aeiou][^aeiouy]$/.test(verb)) {
		pastTense = verb + verb.slice(-1) + "ed";
	} else if (verb.endsWith("y") && !/[aeiou]y$/.test(verb)) {
		pastTense = verb.slice(0, -1) + "ied";
	} else {
		pastTense = verb + "ed";
	}

	let vIng;

	if (verb.endsWith("e") && !verb.endsWith("ee")) {
		vIng = verb.slice(0, -1) + "ing";
	} else if (/[aeiou][^aeiouy]$/.test(verb)) {
		vIng = verb + verb.slice(-1) + "ing";
	} else {
		vIng = verb + "ing";
	}

	return { vIng, pastTense };
}

export function assert(condition: unknown, onFailedMessage = "Condition return a falsely value."): asserts condition {
	if (!condition) {
		throw new Error(onFailedMessage);
	}
}

export function getAbbrName(name: string) {
	const parts = name.trim().split(" ");

	return parts[0][0] + parts[parts.length - 1][0];
}
