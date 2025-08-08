"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, Star, Users, Clock, Target, Trophy, MapPin, Calendar, ArrowRight, CheckCircle } from "lucide-react";

import { Label } from "@/components/shadcn/label";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogTitle, DialogHeader, DialogFooter, DialogContent, DialogDescription } from "@/components/shadcn/dotted-dialog";

import { PlayerStats } from "@/components/interactive/player-stats";
import { TableBooking } from "@/components/interactive/table-booking";
import { TournamentSchedule } from "@/components/interactive/tournament-schedule";
import { LeaderboardDisplay } from "@/components/interactive/leaderboard-display";

export function LandingPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [scrollY, setScrollY] = useState(0);
	const router = useRouter();

	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const headerClass = scrollY > 50 ? "py-4 bg-black/80 backdrop-blur-md border-b border-gray-800/50" : "py-6 bg-transparent";

	return (
		<div className="min-h-screen overflow-hidden bg-black text-white">
			{/* Header */}
			<header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${headerClass}`}>
				<div className="container mx-auto flex items-center justify-between px-4">
					<motion.div
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.5 }}
						initial={{ y: -20, opacity: 0 }}
						className="flex items-center gap-2">
						<span className="text-xl font-bold">mgm Billiards Club</span>
					</motion.div>
					<nav className="hidden items-center gap-8 md:flex">
						{["Tournaments", "Tables", "About", "Members"].map((item, i) => (
							<motion.div
								key={item}
								animate={{ y: 0, opacity: 1 }}
								initial={{ y: -20, opacity: 0 }}
								transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}>
								<Link href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
									{item}
								</Link>
							</motion.div>
						))}
					</nav>
					<motion.div animate={{ y: 0, opacity: 1 }} initial={{ y: -20, opacity: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
						<Button
							onClick={() => router.push("/tournaments")}
							className="hidden rounded-full bg-gradient-to-r from-green-600 to-yellow-600 px-6 py-4 text-white shadow-lg shadow-green-900/30 transition-all duration-300 hover:from-green-700 hover:to-yellow-700 hover:shadow-green-900/50 md:flex">
							Explore <ArrowRight className="h-5 w-5" />
						</Button>
						<Button size="icon" variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
							{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</Button>
					</motion.div>
				</div>
			</header>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						transition={{ duration: 0.3 }}
						exit={{ height: 0, opacity: 0 }}
						initial={{ height: 0, opacity: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						className="fixed left-0 right-0 top-[72px] z-40 border-b border-gray-800 bg-black md:hidden">
						<div className="container mx-auto flex flex-col gap-6 px-4 py-6">
							{["Tournaments", "Tables", "About", "Members"].map((item) => (
								<Link
									key={item}
									href={`#${item.toLowerCase()}`}
									onClick={() => setIsMenuOpen(false)}
									className="text-lg font-medium text-gray-300 transition-colors hover:text-white">
									{item}
								</Link>
							))}
							<Button
								onClick={() => router.push("/tournaments")}
								className="w-full bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700">
								Explore
							</Button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Hero Section */}
			<section className="relative overflow-hidden pb-20 pt-32">
				<div className="absolute inset-0 z-0">
					<div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-black" />
					<div className="absolute left-0 right-0 top-0 h-[500px] bg-gradient-to-b from-green-900/10 to-transparent" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent_65%)]" />
				</div>

				<div className="container relative z-10 mx-auto px-4">
					<div className="mx-auto mb-16 max-w-4xl text-center">
						<motion.h1
							animate={{ y: 0, opacity: 1 }}
							initial={{ y: 20, opacity: 0 }}
							transition={{ delay: 0.2, duration: 0.8 }}
							className="mb-6 bg-gradient-to-r from-white via-green-200 to-yellow-200 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-7xl">
							Master the Game, Win the Glory
						</motion.h1>
						<motion.p
							animate={{ y: 0, opacity: 1 }}
							initial={{ y: 20, opacity: 0 }}
							transition={{ delay: 0.4, duration: 0.8 }}
							className="mx-auto mb-10 max-w-2xl text-base text-gray-300 sm:text-lg md:text-xl">
							Join the most competitive pool tournaments in the company. Professional tables, expert players, and exciting prizes await at mgm
							Billiards Club.
						</motion.p>
					</div>

					<motion.div
						animate={{ y: 0, opacity: 1 }}
						initial={{ y: 40, opacity: 0 }}
						transition={{ delay: 0.8, duration: 1 }}
						className="relative mx-auto w-full max-w-5xl">
						<div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 to-yellow-500/20 blur-3xl" />
						<div className="relative overflow-hidden rounded-lg border border-gray-800/50 bg-gray-900/50 shadow-2xl backdrop-blur-sm">
							<div className="relative h-[300px] w-full overflow-hidden bg-gray-950 p-4 md:h-[500px]">
								{/* Tournament Dashboard Header */}
								<div className="mb-4 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-sm text-gray-300">Tournament Status: Live</span>
									</div>
									<div className="flex gap-2">
										<button className="rounded bg-gray-800 p-1 hover:bg-gray-700">
											<Trophy className="h-4 w-4 text-yellow-500" />
										</button>
									</div>
								</div>

								{/* Tournament Tabs */}
								<div className="mb-4 flex border-b border-gray-800">
									<button className="border-b-2 border-green-500 px-4 py-2 text-sm font-medium text-green-400">Live Matches</button>
									<button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300">Leaderboard</button>
									<button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300">Schedule</button>
									<button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300">Tables</button>
								</div>

								{/* Tournament Stats Cards */}
								<div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
									{[
										{ value: "48", change: "+12", label: "Active Players", color: "text-green-500" },
										{ value: "$2,500", change: "+$500", label: "Prize Pool", color: "text-green-500" },
										{ value: "8/12", change: "67%", label: "Tables in Use", color: "text-yellow-500" },
										{ value: "24", change: "+6", label: "Matches Today", color: "text-green-500" }
									].map((stat, index) => (
										<div key={index} className="rounded-lg border border-gray-800 bg-gray-900 p-3 transition-colors hover:border-gray-700">
											<div className="text-xs text-gray-400">{stat.label}</div>
											<div className="text-lg font-bold">{stat.value}</div>
											<div className={`text-xs ${stat.color} flex items-center gap-1`}>
												{stat.change}
												<ArrowRight className="h-3 w-3" />
											</div>
										</div>
									))}
								</div>

								{/* Live Matches */}
								<div className="mb-4 rounded-lg border border-gray-800 bg-gray-900 p-4">
									<div className="mb-4 flex items-center justify-between">
										<h3 className="text-sm font-medium">Current Matches</h3>
										<div className="flex items-center gap-4">
											<div className="flex items-center gap-1">
												<div className="h-2 w-2 rounded-full bg-green-500"></div>
												<span className="text-xs text-gray-400">Live</span>
											</div>
											<div className="flex items-center gap-1">
												<div className="h-2 w-2 rounded-full bg-yellow-500"></div>
												<span className="text-xs text-gray-400">Break</span>
											</div>
										</div>
									</div>

									<div className="space-y-3">
										{[
											{
												score1: 4,
												score2: 2,
												status: "live",
												table: "Table 1",
												player1: "Mike Chen",
												player2: "Sarah Wilson"
											},
											{
												score1: 3,
												score2: 3,
												status: "live",
												table: "Table 3",
												player2: "Emma Davis",
												player1: "Alex Rodriguez"
											},
											{
												score1: 5,
												score2: 1,
												status: "break",
												table: "Table 5",
												player1: "John Smith",
												player2: "Lisa Brown"
											}
										].map((match, index) => (
											<div key={index} className="flex items-center justify-between rounded bg-gray-800/50 p-2">
												<div className="flex items-center gap-3">
													<div className={`h-2 w-2 rounded-full ${match.status === "live" ? "bg-green-500" : "bg-yellow-500"}`}></div>
													<span className="text-xs font-medium">{match.table}</span>
												</div>
												<div className="flex items-center gap-4 text-xs">
													<span>{match.player1}</span>
													<div className="flex items-center gap-2 font-bold">
														<span className={match.score1 > match.score2 ? "text-green-400" : ""}>{match.score1}</span>
														<span className="text-gray-500">-</span>
														<span className={match.score2 > match.score1 ? "text-green-400" : ""}>{match.score2}</span>
													</div>
													<span>{match.player2}</span>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Leaderboard */}
								<div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
									<div className="flex items-center justify-between border-b border-gray-800 p-3">
										<h3 className="text-sm font-medium">Tournament Leaderboard</h3>
										<button className="text-xs text-green-400 hover:text-green-300">View Full</button>
									</div>
									<div className="overflow-x-auto">
										<table className="w-full text-sm">
											<thead>
												<tr className="bg-gray-950">
													<th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Rank</th>
													<th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Player</th>
													<th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Wins</th>
													<th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Points</th>
													<th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Streak</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-800">
												{[
													{ rank: 1, wins: 8, streak: 5, points: 240, player: "Mike Chen" },
													{ rank: 2, wins: 7, streak: 3, points: 210, player: "Sarah Wilson" },
													{ rank: 3, wins: 6, streak: 2, points: 180, player: "Alex Rodriguez" }
												].map((player, index) => (
													<tr key={index} className="cursor-pointer hover:bg-gray-800/50">
														<td className="px-4 py-2 text-xs">
															<div className="flex items-center gap-2">
																{player.rank === 1 && <Trophy className="h-3 w-3 text-yellow-500" />}#{player.rank}
															</div>
														</td>
														<td className="px-4 py-2 text-xs font-medium">{player.player}</td>
														<td className="px-4 py-2 text-xs">{player.wins}</td>
														<td className="px-4 py-2 text-xs font-bold text-green-400">{player.points}</td>
														<td className="px-4 py-2 text-xs">
															<span className="inline-flex items-center rounded-full bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-400">
																{player.streak} wins
															</span>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Tournaments Section */}
			<section id="tournaments" className="relative overflow-hidden py-24">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_50%)]" />

				<div className="container relative z-10 mx-auto px-4">
					<div className="mb-16 text-center">
						<motion.div viewport={{ once: true }} transition={{ duration: 0.8 }} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}>
							<h2 className="mb-4 text-3xl font-bold md:text-5xl">Tournament Features</h2>
							<p className="mx-auto max-w-2xl text-gray-400">
								Experience professional-grade tournaments with state-of-the-art facilities and competitive gameplay.
							</p>
						</motion.div>
					</div>

					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{[
							{
								title: "Professional Tables",
								icon: <Trophy className="h-10 w-10 text-yellow-500" />,
								description: "Play on regulation 9-foot Diamond tables with Simonis cloth and Aramith balls for the ultimate experience."
							},
							{
								title: "Live Scoring",
								icon: <Target className="h-10 w-10 text-green-500" />,
								description: "Real-time match tracking with digital scoreboards and live streaming of championship matches."
							},
							{
								title: "Expert Referees",
								icon: <Users className="h-10 w-10 text-blue-500" />,
								description: "Certified referees ensure fair play and proper rule enforcement in all tournament matches."
							},
							{
								title: "Prize Pools",
								icon: <Star className="h-10 w-10 text-purple-500" />,
								description: "Compete for substantial cash prizes and trophies in weekly, monthly, and championship tournaments."
							},
							{
								title: "Regular Events",
								icon: <Calendar className="h-10 w-10 text-orange-500" />,
								description: "Weekly tournaments, monthly championships, and special events throughout the year."
							},
							{
								title: "Flexible Schedule",
								icon: <Clock className="h-10 w-10 text-red-500" />,
								description: "Multiple tournament formats and time slots to accommodate players of all skill levels and schedules."
							}
						].map((feature, index) => (
							<motion.div
								key={index}
								viewport={{ once: true }}
								initial={{ y: 20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}>
								<div className="h-full rounded-xl bg-gradient-to-b from-gray-900 to-gray-950 p-[1px]">
									<div className="h-full rounded-xl border border-gray-800/50 bg-gradient-to-b from-gray-900 to-gray-950 p-6 backdrop-blur-sm transition-colors hover:border-green-500/50">
										<div className="mb-4 inline-block rounded-lg bg-gray-800/30 p-3">{feature.icon}</div>
										<h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
										<p className="text-gray-400">{feature.description}</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Tables Section */}
			<section id="tables" className="relative overflow-hidden py-24">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.15),transparent_50%)]" />

				<div className="container relative z-10 mx-auto px-4">
					<div className="mb-16 text-center">
						<motion.div viewport={{ once: true }} transition={{ duration: 0.8 }} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}>
							<h2 className="mb-4 text-3xl font-bold md:text-5xl">Tournament Types</h2>
							<p className="mx-auto max-w-2xl text-gray-400">
								Choose from various tournament formats designed for different skill levels and playing styles.
							</p>
						</motion.div>
					</div>

					<div className="space-y-24">
						{/* 8-Ball Tournament */}
						<div className="grid items-center gap-12 md:grid-cols-2">
							<motion.div
								className="space-y-6"
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
								initial={{ x: -50, opacity: 0 }}
								whileInView={{ x: 0, opacity: 1 }}>
								<h3 className="text-3xl font-bold">8-Ball Championships</h3>
								<p className="text-lg text-gray-300">
									Our most popular tournament format featuring single and double elimination brackets with skill-based divisions.
								</p>
								<ul className="space-y-3">
									{[
										"Beginner, Intermediate & Advanced divisions",
										"Weekly tournaments every Friday",
										"$500+ prize pools",
										"Professional referee supervision"
									].map((feature, i) => (
										<li key={i} className="flex items-center gap-3">
											<CheckCircle className="h-5 w-5 text-green-500" />
											<span>{feature}</span>
										</li>
									))}
								</ul>
								<Button className="bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700">
									Register for 8-Ball
								</Button>
							</motion.div>

							<motion.div viewport={{ once: true }} transition={{ duration: 0.8 }} initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}>
								<div className="rounded-lg bg-gradient-to-br from-green-500/20 to-yellow-500/20 p-1">
									<div className="relative h-[300px] w-full overflow-hidden rounded-lg md:h-[400px]">
										<TournamentSchedule />
									</div>
								</div>
							</motion.div>
						</div>

						{/* 9-Ball Tournament */}
						<div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
							<motion.div
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
								initial={{ x: 50, opacity: 0 }}
								whileInView={{ x: 0, opacity: 1 }}
								className="order-1 space-y-4 md:order-last md:space-y-6">
								<h3 className="text-2xl font-bold md:text-3xl">9-Ball Masters</h3>
								<p className="text-base text-gray-300 md:text-lg">
									Fast-paced 9-ball action with rotation play and strategic shot-making. Perfect for competitive players.
								</p>
								<ul className="space-y-2 md:space-y-3">
									{["Race to 7 format", "Monthly championship events", "Live streaming of finals", "Professional commentary"].map((feature, i) => (
										<li key={i} className="flex items-center gap-2 md:gap-3">
											<CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500 md:h-5 md:w-5" />
											<span className="text-sm md:text-base">{feature}</span>
										</li>
									))}
								</ul>
								<Button className="bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700">
									Register for 9-Ball
								</Button>
							</motion.div>

							<motion.div
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
								initial={{ x: -50, opacity: 0 }}
								whileInView={{ x: 0, opacity: 1 }}
								className="order-2 md:order-first">
								<div className="rounded-lg bg-gradient-to-br from-green-500/20 to-yellow-500/20 p-1">
									<div className="relative h-[300px] w-full overflow-hidden rounded-lg md:h-[400px]">
										<LeaderboardDisplay />
									</div>
								</div>
							</motion.div>
						</div>

						{/* Team Tournament */}
						<div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
							<motion.div
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
								initial={{ x: -50, opacity: 0 }}
								whileInView={{ x: 0, opacity: 1 }}
								className="order-1 space-y-4 md:order-1 md:space-y-6">
								<h3 className="text-2xl font-bold md:text-3xl">Team Championships</h3>
								<p className="text-base text-gray-300 md:text-lg">
									Form teams and compete in our exciting team tournaments. Build camaraderie while competing for glory.
								</p>
								<ul className="space-y-2 md:space-y-3">
									{["4-player team format", "Corporate team leagues", "Seasonal championships", "Team building events"].map((feature, i) => (
										<li key={i} className="flex items-center gap-2 md:gap-3">
											<CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500 md:h-5 md:w-5" />
											<span className="text-sm md:text-base">{feature}</span>
										</li>
									))}
								</ul>
								<Button className="bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700">Form a Team</Button>
							</motion.div>

							<motion.div
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
								className="order-2 md:order-2"
								initial={{ x: 50, opacity: 0 }}
								whileInView={{ x: 0, opacity: 1 }}>
								<div className="rounded-lg bg-gradient-to-br from-green-500/20 to-yellow-500/20 p-1">
									<div className="relative h-[300px] w-full overflow-hidden rounded-lg md:h-[400px]">
										<TableBooking />
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</div>
			</section>

			{/* About Section */}
			<section id="about" className="relative overflow-hidden py-16 md:py-24">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15),transparent_60%)]" />

				<div className="container relative z-10 mx-auto px-4">
					<div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
						<motion.div
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="order-1 md:order-1"
							initial={{ x: -50, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}>
							<h2 className="mb-4 text-2xl font-bold md:mb-6 md:text-3xl lg:text-5xl">About mgm Billiards Club</h2>
							<p className="mb-4 text-sm text-gray-300 sm:text-base md:mb-6 md:text-lg">
								Established in 2018, mgm Billiards Club has become the premier destination for competitive pool in the city. We pride ourselves on
								providing a professional environment where players of all skill levels can improve their game.
							</p>
							<p className="mb-4 text-sm text-gray-300 sm:text-base md:mb-6 md:text-lg">
								Our state-of-the-art facility features 12 professional Diamond tables, expert coaching staff, and a welcoming community of passionate
								players who share your love for the game.
							</p>
							<div className="mb-6 flex flex-wrap gap-2 sm:gap-3 md:mb-8 md:gap-4">
								<div className="rounded-full bg-gray-800/50 px-2 py-1 text-xs backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-sm md:px-4 md:py-2 md:text-base">
									<span className="font-medium text-green-400">200+</span> Active Members
								</div>
								<div className="rounded-full bg-gray-800/50 px-2 py-1 text-xs backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-sm md:px-4 md:py-2 md:text-base">
									<span className="font-medium text-green-400">50+</span> Tournaments/Year
								</div>
								<div className="rounded-full bg-gray-800/50 px-2 py-1 text-xs backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-sm md:px-4 md:py-2 md:text-base">
									<span className="font-medium text-green-400">12</span> Professional Tables
								</div>
							</div>
							<Button variant="outline" className="border-green-500 bg-transparent text-sm text-green-500 hover:bg-green-950 sm:text-base">
								Visit Our Club
							</Button>
						</motion.div>

						<motion.div
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="order-2 md:order-2"
							initial={{ x: 50, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}>
							<div className="relative">
								<div className="absolute -inset-4 rounded-lg bg-gradient-to-r from-green-500/20 to-yellow-500/20 blur-xl" />
								<div className="relative overflow-hidden rounded-lg">
									<div className="h-[300px] w-full md:h-[400px]">
										<PlayerStats />
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Members Section */}
			<section id="members" className="relative overflow-hidden py-24">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_50%)]" />

				<div className="container relative z-10 mx-auto px-4">
					<div className="mb-16 text-center">
						<motion.div viewport={{ once: true }} transition={{ duration: 0.8 }} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}>
							<h2 className="mb-4 text-3xl font-bold md:text-5xl">What Players Are Saying</h2>
							<p className="mx-auto max-w-2xl text-gray-400">See what others say about their mgm experience.</p>
						</motion.div>
					</div>

					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{[
							{
								name: "Shane Van Boening",
								role: "The Precision Breaker",
								image: "https://avatar.vercel.sh/marcus",
								content:
									"The level of competition at mgm is incredible. I've improved my game tremendously since joining, and the tournament organization is top-notch."
							},
							{
								name: "Fedor Gorst",
								role: "The Cool Competitor",
								image: "https://avatar.vercel.sh/lisa",
								content: "Every match here pushes me to play my best. The mgm community is world-class."
							},
							{
								name: "Carlo Biado",
								role: "The Filipino Phenomenon",
								image: "https://avatar.vercel.sh/david",
								content: "I've played all over the world, but mgm has a special vibe—competitive, fun, and full of heart."
							}
						].map((testimonial, index) => (
							<motion.div
								key={index}
								viewport={{ once: true }}
								initial={{ y: 20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}>
								<div className="h-full rounded-xl bg-gradient-to-b from-gray-900 to-gray-950 p-[1px]">
									<div className="h-full rounded-xl border border-gray-800/50 bg-gradient-to-b from-gray-900 to-gray-950 p-8 backdrop-blur-sm">
										<div className="mb-6 flex items-center">
											<div className="relative mr-4 h-12 w-12 overflow-hidden rounded-full">
												<Image fill alt={testimonial.name} className="object-cover" src={testimonial.image || "/placeholder.svg"} />
											</div>
											<div>
												<h4 className="font-bold">{testimonial.name}</h4>
												<p className="text-sm text-gray-400">{testimonial.role}</p>
											</div>
										</div>
										<p className="italic text-gray-300">&#34;{testimonial.content}&#34;</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section id="contact" className="relative overflow-hidden py-24">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.15),transparent_50%)]" />

				<div className="container relative z-10 mx-auto px-4">
					<div className="mx-auto max-w-3xl">
						<motion.div
							viewport={{ once: true }}
							className="mb-12 text-center"
							transition={{ duration: 0.8 }}
							initial={{ y: 20, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}>
							<h2 className="mb-4 text-3xl font-bold md:text-5xl">Ready to Join the Action?</h2>
							<p className="mb-8 text-lg text-gray-300">
								Register for upcoming tournaments or become a member to access exclusive events and practice sessions.
							</p>
						</motion.div>

						<motion.div
							viewport={{ once: true }}
							initial={{ y: 20, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2, duration: 0.8 }}>
							<div className="rounded-xl bg-gradient-to-b from-gray-900 to-gray-950 p-[1px]">
								<div className="rounded-xl border border-gray-800/50 bg-gradient-to-b from-gray-900 to-gray-950 p-8 backdrop-blur-sm">
									<h3 className="mb-6 text-2xl font-bold">Tournament Registration</h3>
									<form className="space-y-6">
										<div className="grid gap-6 md:grid-cols-2">
											<div className="space-y-2">
												<Label htmlFor="name" className="text-gray-300">
													Full Name
												</Label>
												<Input
													id="name"
													type="text"
													placeholder="Enter your full name"
													className="h-12 border-gray-700 bg-gray-800/50 focus:border-green-500"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="email" className="text-gray-300">
													Email
												</Label>
												<Input
													id="email"
													type="email"
													placeholder="Enter your email"
													className="h-12 border-gray-700 bg-gray-800/50 focus:border-green-500"
												/>
											</div>
										</div>
										<div className="grid gap-6 md:grid-cols-2">
											<div className="space-y-2">
												<Label htmlFor="phone" className="text-gray-300">
													Phone Number
												</Label>
												<Input
													id="phone"
													type="tel"
													placeholder="Enter your phone number"
													className="h-12 border-gray-700 bg-gray-800/50 focus:border-green-500"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="skill" className="text-gray-300">
													Skill Level
												</Label>
												<select className="h-12 w-full rounded-md border border-gray-700 bg-gray-800/50 px-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500">
													<option value="">Select skill level</option>
													<option value="beginner">Beginner</option>
													<option value="intermediate">Intermediate</option>
													<option value="advanced">Advanced</option>
													<option value="professional">Professional</option>
												</select>
											</div>
										</div>
										<div className="space-y-2">
											<Label htmlFor="tournament" className="text-gray-300">
												Preferred Tournament
											</Label>
											<select className="h-12 w-full rounded-md border border-gray-700 bg-gray-800/50 px-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500">
												<option value="">Select tournament type</option>
												<option value="8ball">8-Ball Championship</option>
												<option value="9ball">9-Ball Masters</option>
												<option value="team">Team Championship</option>
												<option value="league">Weekly League</option>
											</select>
										</div>
										<div className="space-y-2">
											<Label htmlFor="message" className="text-gray-300">
												Additional Information
											</Label>
											<textarea
												rows={4}
												id="message"
												placeholder="Tell us about your experience or any questions you have"
												className="w-full rounded-md border border-gray-700 bg-gray-800/50 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
										</div>
										<Button className="h-12 w-full bg-gradient-to-r from-green-600 to-yellow-600 text-base hover:from-green-700 hover:to-yellow-700">
											Register for Tournament
										</Button>
									</form>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="relative overflow-hidden border-t border-gray-800/50 py-16">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(34,197,94,0.1),transparent_70%)]" />

				<div className="container relative z-10 mx-auto px-4">
					<div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
						<div>
							<div className="mb-6 flex items-center gap-2">
								<Target className="h-6 w-6 text-green-500" />
								<span className="text-xl font-bold">mgm</span>
							</div>
							<p className="mb-6 text-gray-400">
								The premier destination for competitive pool tournaments. Join our community of passionate players and elevate your game.
							</p>
							<div className="flex items-center gap-2 text-sm text-gray-400">
								<MapPin className="h-4 w-4" />
								<span>Somewhere only we know</span>
							</div>
						</div>

						<div>
							<h4 className="mb-6 text-lg font-bold">Tournaments</h4>
							<ul className="space-y-4">
								{["8-Ball Championship", "9-Ball Masters", "Team Events", "Weekly Leagues", "Special Events"].map((item) => (
									<li key={item}>
										<a href="#" className="text-gray-400 transition-colors hover:text-white">
											{item}
										</a>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h4 className="mb-6 text-lg font-bold">Club Info</h4>
							<ul className="space-y-4">
								{["Membership", "Table Rates", "Coaching", "Private Events", "Facility Rental"].map((item) => (
									<li key={item}>
										<a href="#" className="text-gray-400 transition-colors hover:text-white">
											{item}
										</a>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h4 className="mb-6 text-lg font-bold">Contact</h4>
							<ul className="space-y-4">
								{["Hours", "Location", "Phone", "Email", "Support"].map((item) => (
									<li key={item}>
										<a href="#" className="text-gray-400 transition-colors hover:text-white">
											{item}
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-gray-800/50 pt-8 md:flex-row">
						<p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} mgm Billiards Club. All rights reserved.</p>
						<div className="flex gap-6">
							<a href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
								Privacy Policy
							</a>
							<a href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
								Terms of Service
							</a>
							<a href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
								House Rules
							</a>
						</div>
					</div>
				</div>
			</footer>

			{/* Modal */}
			<Dialog open={isModalOpen} onOpenChange={(open) => !open && setIsModalOpen(false)}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="text-2xl">Join Tournament</DialogTitle>
						<DialogDescription>Register for upcoming tournaments and become part of our competitive pool community.</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="modal-email">Email</Label>
							<Input
								type="email"
								value={email}
								id="modal-email"
								placeholder="Enter your email"
								onChange={(e) => setEmail(e.target.value)}
								className="border-gray-700 bg-gray-800/50 focus:border-green-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="modal-name">Full Name</Label>
							<Input
								type="text"
								id="modal-name"
								placeholder="Enter your full name"
								className="border-gray-700 bg-gray-800/50 focus:border-green-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="modal-skill">Skill Level</Label>
							<select className="w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500">
								<option value="">Select your skill level</option>
								<option value="beginner">Beginner</option>
								<option value="intermediate">Intermediate</option>
								<option value="advanced">Advanced</option>
								<option value="professional">Professional</option>
							</select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsModalOpen(false)}>
							Cancel
						</Button>
						<Button
							className="bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700"
							onClick={() => {
								alert("Registration submitted! We'll contact you with tournament details.");
								setIsModalOpen(false);
							}}>
							Register
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
