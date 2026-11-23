import type { QueryIndex, QueryPredicateIndex } from "./type";
import get_modulo_id_rows from "./get_modulo_id_rows";
import get_timestamp_sampled_rows from "./get_timestamp_sampled_rows";

const index: QueryIndex[] = [get_modulo_id_rows, get_timestamp_sampled_rows];

export const queryIndex: QueryPredicateIndex = async (
  connection,
  queryParam
) => {
  for (const queryIndex of index) {
    const result = await queryIndex.queryPredicate(connection, queryParam);
    if (result.result === "skipped") continue;
    if (result.result === "failed") {
      return {
        result: "failed",
        reasons: result.reasons,
      };
    }
    return {
      result: "success",
      data: result.data,
    };
  }
  return {
    result: "failed",
    reasons: ["No query option matched:", queryParam.queryType],
  };
};
