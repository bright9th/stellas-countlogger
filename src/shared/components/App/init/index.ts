import type { App } from "../class";
import manifest from "./manifest";
import parquet from "./parquet";

export default async function (app: App): Promise<void> {
  await Promise.all([manifest(app), parquet(app)]);
}
