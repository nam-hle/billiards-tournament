import Path from "path";

import { DataSource } from "@/utils/data-source";

export class BaseRepository {
	public readonly DataDir = Path.join(process.cwd(), "src", "data");

	public get dataSource() {
		return new DataSource();
	}
}
