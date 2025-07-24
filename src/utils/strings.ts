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

export function getStatusColor(status: string): string {
	switch (status) {
		case "upcoming":
		case "scheduling":
			return "bg-yellow-100 text-yellow-800";
		case "active":
		case "ongoing":
		case "in-progress":
			return "bg-blue-100 text-blue-800";
		case "qualified":
		case "completed":
			return "bg-green-100 text-green-800";
		case "eliminated":
			return "bg-red-100 text-red-800";
		case "scheduled":
			return "bg-gray-100 text-gray-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}
