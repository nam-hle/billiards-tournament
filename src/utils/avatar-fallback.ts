export function getAvatarFallback(name: string | undefined): string {
	if (!name?.trim()) {
		return "U";
	}

	const words = name.trim().split(/\s+/);

	if (words.length === 1) {
		return words[0].slice(0, 2).toUpperCase();
	}

	return (words[0][0] + words[1][0]).toUpperCase();
}
