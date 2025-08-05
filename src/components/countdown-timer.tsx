import React, { useState, useEffect } from "react";

import { type ISOTime } from "@/interfaces";

export function CountdownTimer({ targetTime }: { targetTime: ISOTime }) {
	const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
	const firstRender = React.useRef(true);

	useEffect(() => {
		function calculateTimeLeft() {
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
		}

		if (firstRender.current) {
			firstRender.current = false;
			calculateTimeLeft();
		}

		const timer = setInterval(calculateTimeLeft, 1000);

		return () => clearInterval(timer);
	}, [targetTime]);

	return (
		<div className="animate-fade-in flex items-center justify-center">
			<div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
				{[
					{ label: "Day", value: timeLeft.days },
					{ label: "Hour", value: timeLeft.hours },
					{ label: "Minute", value: timeLeft.minutes },
					{ label: "Second", value: timeLeft.seconds }
				].map((item) => (
					<div key={item.label} className="mx-6 flex flex-col items-center justify-center">
						<div className="mb-2 backdrop-blur-lg lg:mb-6">
							<span className="font-mono text-8xl font-bold tracking-wider lg:text-9xl">{String(item.value).padStart(2, "0")}</span>
						</div>
						<span className="text-xs font-bold uppercase tracking-wide text-muted-foreground lg:text-sm">
							{item.value > 1 ? item.label + "s" : item.label}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
