import type { QueryIndex, QueryPredicateResult } from "../type";
import type { QueryParamOption } from "../typeExtend";
import query from "./query.sql?raw";
import type { GetModuloIdRowsData, GetModuloIdRowsParam } from "./type";

const index: QueryIndex = {
  queryPredicate: async (connection, queryParam: QueryParamOption) => {
    if (queryParam.queryType !== "get_modulo_id_rows")
      return { result: "skipped", data: null };

    const { table_name, modulo, limit } = queryParam.params;
    if (!Number.isInteger(modulo)) {
      return {
        result: "failed",
        reasons: ["params.modulo is not an integer:", modulo],
      };
    }
    if (limit && !Number.isInteger(limit)) {
      return {
        result: "failed",
        reasons: ["params.limit is not an integer:", limit],
      };
    }

    const stmt = await connection.prepare(query);
    let predicateResult: QueryPredicateResult<GetModuloIdRowsParam>;

    try {
      const result = await stmt.query(table_name, modulo, limit ?? "ALL");
      predicateResult = {
        result: "success",
        data: result
          .toArray()
          .map((row) => row.toJSON()) as GetModuloIdRowsData[],
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
