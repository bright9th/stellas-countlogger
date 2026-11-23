import type { QueryIndex, QueryPredicateResult } from "../type";
import type { QueryParamOption } from "../typeExtend";
import query from "./query.sql?raw";
import type {
  GetTimestampSampledRowsData,
  GetTimestampSampledRowsParam,
} from "./type";

const index: QueryIndex = {
  queryPredicate: async (connection, queryParam: QueryParamOption) => {
    if (queryParam.queryType !== "get_timestamp_sampled_rows")
      return { result: "skipped", data: null };

    const { table_name, target_count } = queryParam.params;
    if (!Number.isInteger(target_count) || target_count < 1) {
      return {
        result: "failed",
        reasons: [
          "params.target_count is not a positive integer:",
          target_count,
        ],
      };
    }

    const stmt = await connection.prepare(query);
    let predicateResult: QueryPredicateResult<GetTimestampSampledRowsParam>;

    try {
      const result = await stmt.query(
        table_name,
        target_count,
        target_count,
        target_count
      );
      predicateResult = {
        result: "success",
        data: result
          .toArray()
          .map((row) => row.toJSON()) as GetTimestampSampledRowsData[],
      };
    } catch (error) {
      predicateResult = { result: "failed", reasons: [error] };
    } finally {
      await stmt.close();
    }

    return predicateResult;
  },
};

export default index;
