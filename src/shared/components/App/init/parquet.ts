import { EXPORT_URL } from "../../../constants/api";
import poll from "../../../poll";
import { NewDatabaseClient } from "../../database/parquet";
import type { App } from "../class";

export default async function (app: App): Promise<void> {
  const db = await NewDatabaseClient();

  // polling for App.manifest change
  await poll(
    () => app.manifest,
    (m) => m !== undefined,
    { intervalMs: 100 }
  );
  const { manifest } = app;
  if (!manifest) {
    app.db = null;
    return;
  }

  // register remote files lazily with url
  const { tables } = manifest;
  if (
    !(await db.loadRemoteParquetBulk([
      {
        url: EXPORT_URL + tables.messages.parquet,
        filename: tables.messages.parquet,
      },
      {
        url: EXPORT_URL + tables.users.parquet,
        filename: tables.users.parquet,
      },
    ]))
  ) {
    app.db = null;
    return;
  }

  app.db = db;
}
