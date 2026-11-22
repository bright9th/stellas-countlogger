import { err, log } from "../../log";
import type { ManifestSchema } from "../database/manifest/schema";
import type { DatabaseClient } from "../database/parquet/class";

export class App {
  #manifest: ManifestSchema | null | undefined = undefined;
  get manifest() {
    return this.#manifest;
  }
  set manifest(value) {
    if (this.#manifest !== undefined) {
      err("[COMPONENT:APP]", "App.manifest already set.");
      return;
    }
    this.#manifest = value;
    log("[COMPONENT:APP]", "App.manifest set.");
  }
  #db: DatabaseClient | null | undefined = undefined;
  get db() {
    return this.#db;
  }
  set db(value) {
    if (this.#db !== undefined) {
      err("[COMPONENT:APP]", "App.db already set.");
      return;
    }
    this.#db = value;
    log("[COMPONENT:APP]", "App.db set.");
  }

  constructor() {}
}
