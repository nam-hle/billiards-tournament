export function formatRatio(ratio: number | undefined | null, fractionDigits = 1): string {
	if (ratio === undefined || ratio === null || isNaN(ratio)) {
		return "-";
	}

	return `${(ratio * 100).toFixed(fractionDigits)}%`;
}

export function toLabel(text: string): string {
	return text
		.split(/[-_]/)
		.map((word) => capitalize(word))
		.join(" ");
}

function capitalize(text: string): string {
	if (!text) {
		return text;
	}

	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getAbbrName(name: string) {
	const parts = name.trim().split(" ");

	return parts[0][0] + parts[parts.length - 1][0];
}

export function getStatusColor(status: string): string {
	switch (status) {
		case "upcoming":
			return "bg-orange-100 text-orange-800 hover:bg-orange-300 hover:text-orange-900";
		case "scheduling":
			return "bg-pink-100 text-pink-800 hover:bg-pink-300 hover:text-pink-900";
		case "active":
		case "ongoing":
		case "in-progress":
			return "bg-blue-100 text-blue-800 hover:bg-blue-300 hover:text-blue-900";
		case "qualified":
		case "completed":
			return "bg-green-100 text-green-800 hover:bg-green-300 hover:text-green-900";
		case "eliminated":
			return "bg-red-100 text-red-800 hover:bg-red-300 hover:text-red-900";
		case "scheduled":
			return "bg-gray-100 text-gray-800 hover:bg-gray-300 hover:text-gray-900";
		default:
			return "bg-gray-100 text-gray-800 hover:bg-gray-300 hover:text-gray-900 ";
	}
}
