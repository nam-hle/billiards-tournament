import React, { useState, useEffect } from "react";

import { type ISOTime } from "@/interfaces";

export function CountdownTimer({ targetTime }: { targetTime: ISOTime }) {
	const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

	useEffect(() => {
		const timer = setInterval(() => {
			const difference = new Date(targetTime).getTime() - new Date().getTime();

			if (difference > 0) {
				setTimeLeft({
					days: Math.floor(difference / (1000 * 60 * 60 * 24)),
					seconds: Math.floor((difference % (1000 * 60)) / 1000),
					minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
					hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
				});
			} else {
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [targetTime]);

	return (
		<div className="animate-fade-in flex items-center justify-center">
			<div className="flex gap-8 shadow-2xl backdrop-blur-2xl">
				{[
					{ label: "Day", value: timeLeft.days },
					{ label: "Hour", value: timeLeft.hours },
					{ label: "Minute", value: timeLeft.minutes },
					{ label: "Second", value: timeLeft.seconds }
				].map((item) => (
					<div key={item.label} className="mx-6 flex flex-col items-center justify-center">
						<div className="mb-6 shadow-xl backdrop-blur-lg">
							<span className="text-9xl font-bold tracking-wider drop-shadow-2xl">{String(item.value).padStart(2, "0")}</span>
						</div>
						<span className="text-sm font-bold uppercase tracking-wide text-muted-foreground drop-shadow">
							{item.value > 1 ? item.label + "s" : item.label}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
