"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User, Award, Target, BarChart3, TrendingUp } from "lucide-react";

import { useMediaQuery } from "@/hooks/use-media-query";

export function PlayerStats() {
	const [selectedPlayer, setSelectedPlayer] = useState("current");
	const [stats, setStats] = useState<any>({});
	const isVerySmall = useMediaQuery("(max-width: 500px)");

	const players = [
		{ id: "current", name: isVerySmall ? "You" : "Your Stats" },
		{ id: "top", name: isVerySmall ? "Top" : "Top Player" },
		{ id: "avg", name: isVerySmall ? "Avg" : "Club Average" }
	];

	// Generate player stats based on selection
	useEffect(() => {
		const generateStats = () => {
			const baseStats = {
				avg: {
					wins: 18,
					streak: 2,
					winRate: 56,
					ranking: 25,
					points: 890,
					avgBreak: 28,
					highBreak: 65,
					tournaments: 5,
					improvement: 8,
					gamesPlayed: 32
				},
				top: {
					wins: 134,
					ranking: 1,
					streak: 12,
					winRate: 86,
					avgBreak: 58,
					points: 3850,
					highBreak: 147,
					improvement: 5,
					tournaments: 24,
					gamesPlayed: 156
				},
				current: {
					wins: 28,
					streak: 3,
					winRate: 62,
					ranking: 15,
					avgBreak: 32,
					points: 1240,
					highBreak: 87,
					tournaments: 8,
					gamesPlayed: 45,
					improvement: 12
				}
			};

			return baseStats[selectedPlayer as keyof typeof baseStats] || baseStats.current;
		};

		setStats(generateStats());
	}, [selectedPlayer]);

	return (
		<div className="h-full rounded-lg border border-gray-800 bg-gray-900 p-3 md:p-6">
			<div className="mb-3 flex items-center justify-between md:mb-6">
				<div className="flex items-center gap-1 md:gap-2">
					<BarChart3 className="h-4 w-4 text-purple-500 md:h-5 md:w-5" />
					<h3 className="text-xs font-medium sm:text-sm md:text-base">Player Statistics</h3>
				</div>
				<div className="flex gap-1 md:gap-2">
					{players.map((player) => (
						<button
							key={player.id}
							onClick={() => setSelectedPlayer(player.id)}
							className={`rounded px-1.5 py-0.5 text-[8px] transition-colors sm:text-[10px] md:px-2 md:py-1 md:text-xs ${
								selectedPlayer === player.id ? "bg-purple-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
							}`}>
							{player.name}
						</button>
					))}
				</div>
			</div>

			{/* Main Stats Grid */}
			<div className="mb-3 grid grid-cols-2 gap-2 md:mb-6 md:gap-4">
				<div className="rounded-lg bg-gray-800/50 p-2 md:p-3">
					<div className="mb-1 flex items-center gap-1 md:mb-2 md:gap-2">
						<Target className="h-3 w-3 text-green-500 md:h-4 md:w-4" />
						<span className="text-[8px] text-gray-400 sm:text-[10px] md:text-xs">Win Rate</span>
					</div>
					<div className="text-lg font-bold text-green-400 md:text-2xl">{stats.winRate}%</div>
					<div className="text-[8px] text-gray-400 sm:text-[10px] md:text-xs">
						{stats.wins}/{stats.gamesPlayed} games
					</div>
				</div>

				<div className="rounded-lg bg-gray-800/50 p-2 md:p-3">
					<div className="mb-1 flex items-center gap-1 md:mb-2 md:gap-2">
						<Award className="h-3 w-3 text-yellow-500 md:h-4 md:w-4" />
						<span className="text-[8px] text-gray-400 sm:text-[10px] md:text-xs">Ranking</span>
					</div>
					<div className="text-lg font-bold text-yellow-400 md:text-2xl">#{stats.ranking}</div>
					<div className="text-[8px] text-gray-400 sm:text-[10px] md:text-xs">{stats.points} points</div>
				</div>

				<div className="rounded-lg bg-gray-800/50 p-2 md:p-3">
					<div className="mb-1 flex items-center gap-1 md:mb-2 md:gap-2">
						<TrendingUp className="h-3 w-3 text-blue-500 md:h-4 md:w-4" />
						<span className="text-[8px] text-gray-400 sm:text-[10px] md:text-xs">Avg Break</span>
					</div>
					<div className="text-lg font-bold text-blue-400 md:text-2xl">{stats.avgBreak}</div>
					<div className="text-[8px] text-gray-400 sm:text-[10px] md:text-xs">High: {stats.highBreak}</div>
				</div>

				<div className="rounded-lg bg-gray-800/50 p-2 md:p-3">
					<div className="mb-1 flex items-center gap-1 md:mb-2 md:gap-2">
						<User className="h-3 w-3 text-purple-500 md:h-4 md:w-4" />
						<span className="text-[8px] text-gray-400 sm:text-[10px] md:text-xs">Tournaments</span>
					</div>
					<div className="text-lg font-bold text-purple-400 md:text-2xl">{stats.tournaments}</div>
					<div className="text-[8px] text-gray-400 sm:text-[10px] md:text-xs">{stats.streak} win streak</div>
				</div>
			</div>

			{/* Performance Chart */}
			<div className="mb-3 rounded-lg bg-gray-800/50 p-2 md:mb-4 md:p-4">
				<div className="mb-2 flex items-center justify-between md:mb-3">
					<h4 className="text-[10px] font-medium sm:text-xs md:text-sm">Recent Performance</h4>
					<span className="text-[8px] text-gray-400 md:text-xs">Last 10 games</span>
				</div>

				<div className="flex h-[60px] items-end justify-between gap-1 md:h-[80px]">
					{Array.from({ length: 10 }, (_, i) => {
						const isWin = Math.random() > (selectedPlayer === "top" ? 0.2 : selectedPlayer === "avg" ? 0.5 : 0.4);
						const height = isWin ? Math.random() * 40 + 60 : Math.random() * 40 + 20;

						return (
							<motion.div
								key={i}
								initial={{ height: 0 }}
								animate={{ height: `${height}%` }}
								transition={{ duration: 0.5, delay: i * 0.1 }}
								title={`Game ${i + 1}: ${isWin ? "Win" : "Loss"}`}
								className={`flex-1 cursor-pointer rounded-sm ${isWin ? "bg-green-500" : "bg-red-500"}`}
							/>
						);
					})}
				</div>
			</div>

			{/* Improvement Metrics */}
			<div className="rounded-lg bg-gray-800/50 p-2 md:p-3">
				<h4 className="mb-2 text-[10px] font-medium sm:text-xs md:text-sm">Monthly Progress</h4>

				<div className="space-y-2 md:space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-[8px] text-gray-400 sm:text-[10px] md:text-xs">Win Rate</span>
						<div className="flex items-center gap-1 md:gap-2">
							<div className="h-1 w-16 rounded-full bg-gray-700 md:h-1.5 md:w-20">
								<motion.div
									initial={{ width: 0 }}
									transition={{ duration: 0.5 }}
									animate={{ width: `${stats.winRate}%` }}
									className="h-full rounded-full bg-green-500"
								/>
							</div>
							<span className="text-[8px] text-green-400 sm:text-[10px] md:text-xs">+{stats.improvement}%</span>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-[8px] text-gray-400 sm:text-[10px] md:text-xs">Break Average</span>
						<div className="flex items-center gap-1 md:gap-2">
							<div className="h-1 w-16 rounded-full bg-gray-700 md:h-1.5 md:w-20">
								<motion.div
									initial={{ width: 0 }}
									transition={{ duration: 0.5 }}
									className="h-full rounded-full bg-blue-500"
									animate={{ width: `${(stats.avgBreak / 100) * 100}%` }}
								/>
							</div>
							<span className="text-[8px] text-blue-400 sm:text-[10px] md:text-xs">+{Math.floor(stats.improvement / 2)}</span>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-[8px] text-gray-400 sm:text-[10px] md:text-xs">Tournament Participation</span>
						<div className="flex items-center gap-1 md:gap-2">
							<div className="h-1 w-16 rounded-full bg-gray-700 md:h-1.5 md:w-20">
								<motion.div
									initial={{ width: 0 }}
									transition={{ duration: 0.5 }}
									className="h-full rounded-full bg-purple-500"
									animate={{ width: `${(stats.tournaments / 30) * 100}%` }}
								/>
							</div>
							<span className="text-[8px] text-purple-400 sm:text-[10px] md:text-xs">+{Math.floor(stats.tournaments / 4)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
