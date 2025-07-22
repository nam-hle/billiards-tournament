"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Star, Award, Trophy, TrendingUp } from "lucide-react";

import { useMediaQuery } from "@/hooks/use-media-query";

export function LeaderboardDisplay() {
	const [selectedPeriod, setSelectedPeriod] = useState("monthly");
	const [players, setPlayers] = useState<any[]>([]);
	const isMobile = useMediaQuery("(max-width: 768px)");
	const isVerySmall = useMediaQuery("(max-width: 500px)");

	const periods = [
		{ id: "weekly", label: isVerySmall ? "Week" : "Weekly" },
		{ id: "monthly", label: isVerySmall ? "Month" : "Monthly" },
		{ id: "yearly", label: isVerySmall ? "Year" : "Yearly" }
	];

	// Generate leaderboard data based on selected period
	useEffect(() => {
		const generatePlayers = () => {
			const baseNames = ["Mike Chen", "Sarah Wilson", "Alex Rodriguez", "Emma Davis", "John Smith", "Lisa Brown", "David Kim", "Maria Garcia"];

			return baseNames.map((name, index) => ({
				name,
				id: index + 1,
				rank: index + 1,
				streak: Math.floor(Math.random() * 8) + 1,
				tournaments: Math.floor(Math.random() * 10) + 3,
				wins: Math.floor(Math.random() * 20) + 5 - index,
				change: index < 3 ? "up" : index > 5 ? "down" : "same",
				winRate: Math.floor(Math.random() * 30) + 70 - index * 2,
				points: Math.floor(Math.random() * 500) + 200 - index * 20
			}));
		};

		setPlayers(generatePlayers());
	}, [selectedPeriod]);

	return (
		<div className="h-full rounded-lg border border-gray-800 bg-gray-900 p-3 md:p-6">
			<div className="mb-3 flex items-center justify-between md:mb-6">
				<div className="flex items-center gap-1 md:gap-2">
					<Trophy className="h-4 w-4 text-yellow-500 md:h-5 md:w-5" />
					<h3 className="text-xs font-medium sm:text-sm md:text-base">Leaderboard</h3>
				</div>
				<div className="flex gap-1 md:gap-2">
					{periods.map((period) => (
						<button
							key={period.id}
							onClick={() => setSelectedPeriod(period.id)}
							className={`rounded px-1.5 py-0.5 text-[8px] transition-colors sm:text-[10px] md:px-2 md:py-1 md:text-xs ${
								selectedPeriod === period.id ? "bg-green-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
							}`}>
							{period.label}
						</button>
					))}
				</div>
			</div>

			<div className="mb-3 space-y-1 md:mb-6 md:space-y-2">
				{players.slice(0, isMobile ? 6 : 8).map((player, index) => (
					<motion.div
						key={player.id}
						animate={{ x: 0, opacity: 1 }}
						initial={{ x: -20, opacity: 0 }}
						transition={{ duration: 0.3, delay: index * 0.05 }}
						className={`flex items-center justify-between rounded-lg p-2 md:p-3 ${
							index < 3 ? "bg-gradient-to-r from-yellow-900/20 to-gray-800/50" : "bg-gray-800/30"
						} transition-colors hover:bg-gray-700/50`}>
						<div className="flex items-center gap-2 md:gap-3">
							<div className="flex items-center gap-1 md:gap-2">
								{index === 0 && <Trophy className="h-3 w-3 text-yellow-500 md:h-4 md:w-4" />}
								{index === 1 && <Award className="h-3 w-3 text-gray-400 md:h-4 md:w-4" />}
								{index === 2 && <Star className="h-3 w-3 text-orange-500 md:h-4 md:w-4" />}
								<span className="w-4 text-xs font-bold md:w-6 md:text-sm">#{player.rank}</span>
							</div>
							<div>
								<div className="text-xs font-medium md:text-sm">{isVerySmall ? player.name.split(" ")[0] : player.name}</div>
								<div className="text-[8px] text-gray-400 md:text-xs">
									{player.wins}W • {player.winRate}% • {player.tournaments}T
								</div>
							</div>
						</div>

						<div className="flex items-center gap-1 md:gap-2">
							<div className="text-right">
								<div className="text-xs font-bold text-green-400 md:text-sm">{player.points}</div>
								<div className="text-[8px] text-gray-400 md:text-xs">{player.streak} streak</div>
							</div>
							{player.change === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
							{player.change === "down" && <TrendingUp className="h-3 w-3 rotate-180 text-red-500" />}
						</div>
					</motion.div>
				))}
			</div>

			<div className="rounded-lg bg-gray-800/50 p-2 md:p-3">
				<div className="mb-2 flex items-center justify-between">
					<h4 className="text-xs font-medium md:text-sm">Tournament Stats</h4>
					<span className="text-[8px] text-gray-400 md:text-xs">{selectedPeriod}</span>
				</div>

				<div className="grid grid-cols-2 gap-2 md:gap-4">
					<div className="text-center">
						<div className="text-xs font-bold text-green-400 md:text-sm">
							{selectedPeriod === "weekly" ? "12" : selectedPeriod === "monthly" ? "48" : "156"}
						</div>
						<div className="text-[8px] text-gray-400 md:text-xs">Total Matches</div>
					</div>
					<div className="text-center">
						<div className="text-xs font-bold text-yellow-400 md:text-sm">
							${selectedPeriod === "weekly" ? "1,200" : selectedPeriod === "monthly" ? "4,800" : "18,500"}
						</div>
						<div className="text-[8px] text-gray-400 md:text-xs">Prizes Awarded</div>
					</div>
				</div>
			</div>
		</div>
	);
}
