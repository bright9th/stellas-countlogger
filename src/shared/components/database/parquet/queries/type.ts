import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import type { QueryData, QueryParamOption } from "./typeExtend";

export type QueryPredicateResult<T extends QueryParamOption> =
  | { result: "success"; data: QueryData<T> }
  | { result: "failed"; reasons: unknown[] };

export type QueryPredicateIndex = <T extends QueryParamOption>(
  connection: AsyncDuckDBConnection,
  queryParam: T
) => Promise<QueryPredicateResult<T>>;

export type QueryPredicate = <T extends QueryParamOption>(
  connection: AsyncDuckDBConnection,
  queryParam: T
) => Promise<{ result: "skipped" } | QueryPredicateResult<T>>;

export type QueryIndex = {
  queryPredicate: QueryPredicate;
};

type QueryParam = {
  queryType: string;
  params: object;
};

export type EnsureQueryParam<T extends QueryParam> = T;

export type QueryTableName = "messages" | "users";
