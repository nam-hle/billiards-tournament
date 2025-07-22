"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Clock, Users, Trophy, MapPin, Calendar } from "lucide-react";

import { useMediaQuery } from "@/hooks/use-media-query";

export function TournamentSchedule() {
	const [selectedTournament, setSelectedTournament] = useState<number | null>(0);
	const [currentTime, setCurrentTime] = useState(new Date());
	const isVerySmall = useMediaQuery("(max-width: 500px)");

	// Update current time every minute
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	const tournaments = [
		{
			id: 1,
			type: "8-Ball",
			maxPlayers: 32,
			registered: 24,
			status: "Open",
			time: "7:00 PM",
			entryFee: "$25",
			prizePool: "$500",
			date: "2024-01-26",
			format: "Single Elimination",
			name: isVerySmall ? "8-Ball Fri" : "Friday 8-Ball"
		},
		{
			id: 2,
			type: "9-Ball",
			maxPlayers: 24,
			registered: 18,
			status: "Open",
			time: "2:00 PM",
			entryFee: "$30",
			prizePool: "$600",
			date: "2024-01-27",
			format: "Double Elimination",
			name: isVerySmall ? "9-Ball Sat" : "Saturday 9-Ball"
		},
		{
			id: 3,
			type: "Team",
			maxPlayers: 16,
			registered: 12,
			status: "Open",
			time: "1:00 PM",
			entryFee: "$80",
			prizePool: "$800",
			date: "2024-01-28",
			format: "4-Player Teams",
			name: isVerySmall ? "Team Sun" : "Sunday Team"
		},
		{
			id: 4,
			maxPlayers: 48,
			registered: 35,
			entryFee: "$50",
			time: "12:00 PM",
			date: "2024-02-03",
			prizePool: "$1200",
			type: "Championship",
			status: "Filling Fast",
			format: "Double Elimination",
			name: isVerySmall ? "Monthly" : "Monthly Championship"
		}
	];

	return (
		<div className="h-full rounded-lg border border-gray-800 bg-gray-900 p-3 md:p-6">
			<div className="mb-3 flex items-center justify-between md:mb-6">
				<div className="flex items-center gap-1 md:gap-2">
					<Calendar className="h-4 w-4 text-green-500 md:h-5 md:w-5" />
					<h3 className="text-xs font-medium sm:text-sm md:text-base">Tournament Schedule</h3>
				</div>
				<div className="text-[8px] text-gray-400 sm:text-xs">{currentTime.toLocaleDateString()}</div>
			</div>

			<div className="mb-3 space-y-2 md:mb-6 md:space-y-3">
				{tournaments.map((tournament, index) => (
					<button
						key={tournament.id}
						onClick={() => setSelectedTournament(index)}
						className={`w-full rounded-lg border p-2 text-left transition-colors md:p-3 ${
							selectedTournament === index ? "border-green-500 bg-green-500/10" : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
						}`}>
						<div className="mb-1 flex items-start justify-between md:mb-2">
							<div>
								<h4 className="text-xs font-medium sm:text-sm md:text-base">{tournament.name}</h4>
								<div className="flex items-center gap-1 text-[8px] text-gray-400 sm:text-[10px] md:gap-2 md:text-xs">
									<Clock className="h-2 w-2 md:h-3 md:w-3" />
									<span>
										{tournament.date} • {tournament.time}
									</span>
								</div>
							</div>
							<div className="text-right">
								<div className="text-[8px] font-medium text-green-400 sm:text-[10px] md:text-xs">{tournament.prizePool}</div>
								<div
									className={`rounded-full px-1 py-0.5 text-[6px] sm:text-[8px] md:px-1.5 md:text-[10px] ${
										tournament.status === "Open" ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"
									}`}>
									{tournament.status}
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1 text-[8px] text-gray-400 sm:text-[10px] md:gap-2 md:text-xs">
								<Users className="h-2 w-2 md:h-3 md:w-3" />
								<span>
									{tournament.registered}/{tournament.maxPlayers}
								</span>
							</div>
							<div className="text-[8px] text-gray-400 sm:text-[10px] md:text-xs">{tournament.entryFee}</div>
						</div>
					</button>
				))}
			</div>

			{selectedTournament !== null && (
				<motion.div
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.3 }}
					initial={{ y: 20, opacity: 0 }}
					className="rounded-lg bg-gray-800/50 p-2 md:p-4">
					<div className="mb-2 flex items-center justify-between md:mb-3">
						<h4 className="text-xs font-medium sm:text-sm md:text-base">Tournament Details</h4>
						<Trophy className="h-3 w-3 text-yellow-500 md:h-4 md:w-4" />
					</div>

					<div className="space-y-1.5 md:space-y-2">
						<div className="flex justify-between text-[8px] sm:text-[10px] md:text-xs">
							<span className="text-gray-400">Format:</span>
							<span>{tournaments[selectedTournament].format}</span>
						</div>
						<div className="flex justify-between text-[8px] sm:text-[10px] md:text-xs">
							<span className="text-gray-400">Entry Fee:</span>
							<span className="text-green-400">{tournaments[selectedTournament].entryFee}</span>
						</div>
						<div className="flex justify-between text-[8px] sm:text-[10px] md:text-xs">
							<span className="text-gray-400">Prize Pool:</span>
							<span className="font-medium text-yellow-400">{tournaments[selectedTournament].prizePool}</span>
						</div>
						<div className="flex justify-between text-[8px] sm:text-[10px] md:text-xs">
							<span className="text-gray-400">Players:</span>
							<span>
								{tournaments[selectedTournament].registered}/{tournaments[selectedTournament].maxPlayers}
							</span>
						</div>
					</div>

					<div className="mt-2 border-t border-gray-700 pt-2 md:mt-4 md:pt-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1 text-[8px] text-gray-400 sm:text-[10px] md:gap-2 md:text-xs">
								<MapPin className="h-2 w-2 md:h-3 md:w-3" />
								<span>Tables 1-6</span>
							</div>
							<button className="text-[8px] font-medium text-green-400 hover:text-green-300 sm:text-[10px] md:text-xs">Register Now</button>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	);
}
