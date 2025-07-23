export function extractTournamentId(path: string): string | null {
	const match = path.match(/^\/tournaments\/([^/]+)\/?/);

	return match ? match[1] : null;
}
