import type { EnsureQueryParam, QueryTableName } from "../type";

export type GetModuloIdRowsParam = EnsureQueryParam<{
  queryType: "get_modulo_id_rows";
  params: {
    table_name: QueryTableName;
    modulo: number;
    limit?: number;
  };
}>;

export type GetModuloIdRowsData = {
  id: number;
  author_id: number;
  content: string;
  timestamp: number;
};
