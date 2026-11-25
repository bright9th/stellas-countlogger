import type { GetModuloIdRowsData } from "../../../shared/components/database/parquet/queries/get_modulo_id_rows/type";
import type { CountPoint } from "./type";

export function normalizeCountPoints(
  rows: GetModuloIdRowsData[]
): CountPoint[] {
  return rows
    .map((row): CountPoint | null => {
      const count = Number(row.content);
      if (!Number.isFinite(count)) return null;

      const timestamp = toNumber(row.timestamp);
      if (timestamp === null) return null;

      return {
        count,
        timestamp: timestamp * 1000,
      };
    })
    .filter((point): point is CountPoint => point !== null)
    .sort((a, b) => a.timestamp - b.timestamp);
}

function toNumber(value: unknown): number | null {
  if (typeof value === "bigint") {
    return Number(value);
  }
  if (typeof value === "number" || typeof value === "string") {
    const converted = Number(value);
    return Number.isFinite(converted) ? converted : null;
  }
  return null;
}
