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
		<div className="grid grid-cols-4 gap-4 text-center">
			<div className="rounded-lg border p-3">
				<div className="text-2xl font-bold text-primary">{timeLeft.days}</div>
				<div className="text-xs text-muted-foreground">Days</div>
			</div>
			<div className="rounded-lg border p-3">
				<div className="text-2xl font-bold text-primary">{timeLeft.hours}</div>
				<div className="text-xs text-muted-foreground">Hours</div>
			</div>
			<div className="rounded-lg border p-3">
				<div className="text-2xl font-bold text-primary">{timeLeft.minutes}</div>
				<div className="text-xs text-muted-foreground">Minutes</div>
			</div>
			<div className="rounded-lg border p-3">
				<div className="text-2xl font-bold text-primary">{timeLeft.seconds}</div>
				<div className="text-xs text-muted-foreground">Seconds</div>
			</div>
		</div>
	);
}
