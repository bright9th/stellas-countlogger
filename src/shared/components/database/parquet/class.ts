import * as duckdb from "@duckdb/duckdb-wasm";
import { err, log } from "../../../log";
import type { QueryData, QueryParamOption } from "./queries/typeExtend";
import { queryIndex } from "./queries";

export class DatabaseClient {
  #initialized: boolean = false;
  #db: duckdb.AsyncDuckDB = null!;
  get db() {
    return this.#db;
  }
  #connection: duckdb.AsyncDuckDBConnection = null!;
  get connection() {
    return this.#connection;
  }

  constructor() {}

  async init(): Promise<void> {
    if (this.#initialized) return;
    log("[DATABASE:INIT]", "Starting...");

    await this.#createWorker();

    log("[DATABASE:INIT]", "Success.");
    this.#initialized = true;
  }

  async #createWorker(): Promise<void> {
    const bundles = duckdb.getJsDelivrBundles();
    const bundle = await duckdb.selectBundle(bundles);

    const workerUrl = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker}");`], {
        type: "text/javascript",
      })
    );
    const worker = new Worker(workerUrl);

    this.#db = new duckdb.AsyncDuckDB(new duckdb.ConsoleLogger(), worker);
    await this.#db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    this.#connection = await this.#db.connect();
    log("[DATABASE:INIT:WORKER]", "Created worker.");
  }

  async loadRemoteParquetBulk(
    register: { url: string; filename: string }[]
  ): Promise<boolean> {
    return (
      await Promise.all(
        register.map((reg) => {
          const { url, filename } = reg;
          return this.loadRemoteParquet(url, filename);
        })
      )
    ).some((result) => result !== false);
  }
  async loadRemoteParquet(url: string, filename: string): Promise<boolean> {
    try {
      await this.#db.registerFileURL(
        filename,
        url,
        duckdb.DuckDBDataProtocol.HTTP,
        false
      );
      log("[DATABASE:WORKER]", "Registered:", filename);
      return true;
    } catch (error) {
      err(
        "[DATABASE:WORKER]",
        "Register failed for",
        filename,
        "| Error:",
        error
      );
      return false;
    }
  }

  async query<T extends QueryParamOption>(
    queryParam: T
  ): Promise<QueryData<T> | null> {
    const result = await queryIndex(this.#connection, queryParam);
    if (result.result === "failed") {
      err("[DATABASE:QUERY]", "Error:", ...result.reasons);
      return null;
    }
    log("[DATABASE:QUERY]", "Success for type:", queryParam.queryType);
    return result.data;
  }
}
