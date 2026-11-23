export default async function () {
  return globalThis.App.db!.query({
    queryType: "get_modulo_id_rows",
    params: {
      table_name: "messages",
      modulo: 67,
      limit: 69,
    },
  });
}
