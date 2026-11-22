export type ManifestSchema = {
  "format": string;
  "version": 1;
  "exportedAt": string;
  "snapshot": {
    "timestamp": string;
    "id": string;
  };
  "tables": {
    "messages": {
      "csv": string;
      "parquet": string;
      "rowCount": number;
    };
    "users": {
      "csv": string;
      "parquet": string;
      "rowCount": number;
    };
  };
};

export function isManifestSchema(value: unknown): value is ManifestSchema {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  if (
    typeof obj.format !== "string" ||
    obj.version !== 1 ||
    typeof obj.exportedAt !== "string"
  ) {
    return false;
  }
  // Validate snapshot
  if (
    typeof obj.snapshot !== "object" ||
    obj.snapshot === null ||
    Array.isArray(obj.snapshot)
  ) {
    return false;
  }
  const snapshot = obj.snapshot as Record<string, unknown>;
  if (
    typeof snapshot.timestamp !== "string" ||
    typeof snapshot.id !== "string"
  ) {
    return false;
  }
  // Validate tables
  if (
    typeof obj.tables !== "object" ||
    obj.tables === null ||
    Array.isArray(obj.tables)
  ) {
    return false;
  }
  const tables = obj.tables as Record<string, unknown>;
  // Validate individual table structure
  const isTable = (table: unknown): boolean => {
    if (typeof table !== "object" || table === null || Array.isArray(table)) {
      return false;
    }
    const t = table as Record<string, unknown>;
    return (
      typeof t.csv === "string" &&
      typeof t.parquet === "string" &&
      typeof t.rowCount === "number" &&
      Number.isFinite(t.rowCount)
    );
  };
  return isTable(tables.messages) && isTable(tables.users);
}
