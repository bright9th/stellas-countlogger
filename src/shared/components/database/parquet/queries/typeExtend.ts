import type {
  GetModuloIdRowsData,
  GetModuloIdRowsParam,
} from "./get_modulo_id_rows/type";
import type {
  GetTimestampSampledRowsData,
  GetTimestampSampledRowsParam,
} from "./get_timestamp_sampled_rows/type";

export type QueryDataMap = {
  get_modulo_id_rows: GetModuloIdRowsData[];
  get_timestamp_sampled_rows: GetTimestampSampledRowsData[];
};

export type QueryParamOption =
  GetModuloIdRowsParam | GetTimestampSampledRowsParam;

export type QueryData<T extends QueryParamOption> =
  QueryDataMap[T["queryType"]];
