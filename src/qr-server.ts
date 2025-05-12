/* eslint-disable no-console */
import fs from "fs";
import path from "path";

import cors from "cors";
import express from "express";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

function getQRCodeData() {
	try {
		const sampleImagePath = path.join(__dirname, "..", "public", "cat.jpg");

		const imageBuffer = fs.readFileSync(sampleImagePath);

		return imageBuffer.toString("base64");
	} catch (error) {
		console.error("Failed to read sample QR code image", error);
	}
}

app.post("/v2/generate", (req, res) => {
	res.json({
		code: "00",
		message: "Success",
		data: {
			qrDataURL: `data:image/jpg;base64,${getQRCodeData()}`
		}
	});
});

app.get("/", (_req, res) => {
	res.json({ ok: true });
});

app.listen(PORT, () => {
	console.log(`Mock VietQR API running on http://localhost:${PORT}`);
});
