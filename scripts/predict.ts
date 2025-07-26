import { GroupRepository } from "@/repositories/group.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";

async function predict() {
	const groupRepo = new GroupRepository();

	await Promise.all(
		(await new TournamentRepository().getAll()).map(async (tournament) => {
			await groupRepo.updatePrediction({ year: tournament.year });
			console.log(`Predictions computed successfully for ${tournament.year}.`);
		})
	);
}

predict()
	.then(() => console.log("All predictions computed successfully."))
	.catch((error) => console.error("Error computing predictions:", error));
