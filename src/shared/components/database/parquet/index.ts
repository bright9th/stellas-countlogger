import { DatabaseClient } from "./class";

export async function NewDatabaseClient(): Promise<DatabaseClient> {
  const client = new DatabaseClient();
  await client.init();
  return client;
}
