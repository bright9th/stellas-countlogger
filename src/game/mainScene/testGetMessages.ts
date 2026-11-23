export default async function () {
  const targetPoints = 250;

  return globalThis.App.db!.query({
    queryType: "get_timestamp_sampled_rows",
    params: {
      table_name: "messages",
      target_count: targetPoints,
    },
  });
}
