"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Clock, XCircle, Calendar, CheckCircle } from "lucide-react";

import { useMediaQuery } from "@/hooks/use-media-query";

export function TableBooking() {
	const [selectedTable, setSelectedTable] = useState<number | null>(1);
	const [selectedTime, setSelectedTime] = useState<string | null>("7:00 PM");
	const [tables, setTables] = useState<any[]>([]);
	const isMobile = useMediaQuery("(max-width: 768px)");

	// Generate table data
	useEffect(() => {
		const generateTables = () => {
			return Array.from({ length: 12 }, (_, i) => ({
				id: i + 1,
				name: `Table ${i + 1}`,
				nextAvailable: "8:30 PM",
				hourlyRate: i < 8 ? "$15" : "$12",
				type: i < 8 ? "9ft Diamond" : "8ft Brunswick",
				timeRemaining: Math.floor(Math.random() * 120) + 30,
				currentPlayers: Math.random() > 0.5 ? ["Mike C.", "Sarah W."] : ["Alex R.", "Emma D."],
				status: Math.random() > 0.6 ? "occupied" : Math.random() > 0.3 ? "available" : "reserved"
			}));
		};

		setTables(generateTables());
	}, []);

	const timeSlots = ["6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM"];

	return (
		<div className="h-full rounded-lg border border-gray-800 bg-gray-900 p-3 md:p-6">
			<div className="mb-3 flex items-center justify-between md:mb-6">
				<div className="flex items-center gap-1 md:gap-2">
					<Calendar className="h-4 w-4 text-blue-500 md:h-5 md:w-5" />
					<h3 className="text-xs font-medium sm:text-sm md:text-base">Table Booking</h3>
				</div>
				<div className="text-[8px] text-gray-400 sm:text-xs">Today • {new Date().toLocaleDateString()}</div>
			</div>

			{/* Time Slots */}
			<div className="mb-3 md:mb-4">
				<h4 className="mb-2 text-xs font-medium md:text-sm">Available Times</h4>
				<div className="flex gap-1 overflow-x-auto pb-2 md:gap-2">
					{timeSlots.map((time) => (
						<button
							key={time}
							onClick={() => setSelectedTime(time)}
							className={`whitespace-nowrap rounded px-2 py-1 text-[8px] transition-colors sm:text-[10px] md:px-3 md:py-1.5 md:text-xs ${
								selectedTime === time ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
							}`}>
							{time}
						</button>
					))}
				</div>
			</div>

			{/* Table Grid */}
			<div className="mb-3 md:mb-4">
				<h4 className="mb-2 text-xs font-medium md:text-sm">Select Table</h4>
				<div className="grid grid-cols-3 gap-2 md:grid-cols-4 md:gap-3">
					{tables.slice(0, isMobile ? 9 : 12).map((table) => (
						<button
							key={table.id}
							disabled={table.status !== "available"}
							onClick={() => table.status === "available" && setSelectedTable(table.id)}
							className={`rounded-lg border p-2 transition-colors md:p-3 ${
								selectedTable === table.id
									? "border-blue-500 bg-blue-500/10"
									: table.status === "available"
										? "border-gray-700 bg-gray-800/30 hover:border-gray-600"
										: "cursor-not-allowed border-gray-800 bg-gray-800/10 opacity-50"
							}`}>
							<div className="mb-1 flex items-center justify-center">
								{table.status === "available" && <CheckCircle className="h-3 w-3 text-green-500 md:h-4 md:w-4" />}
								{table.status === "occupied" && <XCircle className="h-3 w-3 text-red-500 md:h-4 md:w-4" />}
								{table.status === "reserved" && <Clock className="h-3 w-3 text-yellow-500 md:h-4 md:w-4" />}
							</div>
							<div className="text-[8px] font-medium sm:text-[10px] md:text-xs">{table.name}</div>
							<div className="text-[6px] capitalize text-gray-400 sm:text-[8px] md:text-[10px]">{table.status}</div>
						</button>
					))}
				</div>
			</div>

			{/* Table Details */}
			{selectedTable && (
				<motion.div
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.3 }}
					initial={{ y: 20, opacity: 0 }}
					className="rounded-lg bg-gray-800/50 p-2 md:p-4">
					<div className="mb-2 flex items-center justify-between md:mb-3">
						<h4 className="text-xs font-medium sm:text-sm md:text-base">Table {selectedTable} Details</h4>
						<div className="text-[8px] font-medium text-green-400 sm:text-[10px] md:text-xs">
							{tables.find((t) => t.id === selectedTable)?.hourlyRate}/hour
						</div>
					</div>

					<div className="mb-3 space-y-1.5 md:mb-4 md:space-y-2">
						<div className="flex justify-between text-[8px] sm:text-[10px] md:text-xs">
							<span className="text-gray-400">Table Type:</span>
							<span>{tables.find((t) => t.id === selectedTable)?.type}</span>
						</div>
						<div className="flex justify-between text-[8px] sm:text-[10px] md:text-xs">
							<span className="text-gray-400">Selected Time:</span>
							<span className="text-blue-400">{selectedTime}</span>
						</div>
						<div className="flex justify-between text-[8px] sm:text-[10px] md:text-xs">
							<span className="text-gray-400">Duration:</span>
							<span>1 hour</span>
						</div>
						<div className="flex justify-between text-[8px] sm:text-[10px] md:text-xs">
							<span className="text-gray-400">Total Cost:</span>
							<span className="font-medium text-green-400">{tables.find((t) => t.id === selectedTable)?.hourlyRate}</span>
						</div>
					</div>

					<div className="flex gap-2">
						<button className="flex-1 rounded bg-blue-600 px-2 py-1.5 text-[8px] text-white transition-colors hover:bg-blue-700 sm:text-[10px] md:px-3 md:py-2 md:text-xs">
							Book Now
						</button>
						<button className="flex-1 rounded bg-gray-700 px-2 py-1.5 text-[8px] text-white transition-colors hover:bg-gray-600 sm:text-[10px] md:px-3 md:py-2 md:text-xs">
							Add to Cart
						</button>
					</div>
				</motion.div>
			)}

			{/* Legend */}
			<div className="mt-3 border-t border-gray-700 pt-2 md:mt-4 md:pt-3">
				<div className="flex items-center justify-between text-[8px] sm:text-[10px] md:text-xs">
					<div className="flex items-center gap-1">
						<CheckCircle className="h-2 w-2 text-green-500 md:h-3 md:w-3" />
						<span className="text-gray-400">Available</span>
					</div>
					<div className="flex items-center gap-1">
						<XCircle className="h-2 w-2 text-red-500 md:h-3 md:w-3" />
						<span className="text-gray-400">Occupied</span>
					</div>
					<div className="flex items-center gap-1">
						<Clock className="h-2 w-2 text-yellow-500 md:h-3 md:w-3" />
						<span className="text-gray-400">Reserved</span>
					</div>
				</div>
			</div>
		</div>
	);
}
