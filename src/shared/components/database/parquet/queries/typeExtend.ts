import type {
  GetModuloIdRowsData,
  GetModuloIdRowsParam,
} from "./get_modulo_id_rows/type";

export type QueryDataMap = {
  get_modulo_id_rows: GetModuloIdRowsData[];
};

export type QueryParamOption = GetModuloIdRowsParam;

export type QueryData<T extends QueryParamOption> =
  QueryDataMap[T["queryType"]];
