import type { EnsureQueryParam, QueryTableName } from "../type";

export type GetTimestampSampledRowsParam = EnsureQueryParam<{
  queryType: "get_timestamp_sampled_rows";
  params: {
    table_name: QueryTableName;
    target_count: number;
  };
}>;

export type GetTimestampSampledRowsData = {
  id: number;
  author_id: number;
  content: string;
  timestamp: number;
};
