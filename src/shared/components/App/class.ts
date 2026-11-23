import type { Game } from "../../../game";
import { err, log } from "../../log";
import type { ManifestSchema } from "../database/manifest/schema";
import type { DatabaseClient } from "../database/parquet/class";

function setOnce<T>(
  current: T | undefined,
  value: T,
  name: string
): T | undefined {
  if (current !== undefined) {
    err("[COMPONENT:APP]", `App.${name} already set.`);
    return current;
  }
  log("[COMPONENT:APP]", `App.${name} set.`);
  return value;
}

export class App {
  #manifest: ManifestSchema | null | undefined = undefined;
  #db: DatabaseClient | null | undefined = undefined;
  #game: Game | null | undefined = undefined;

  get manifest() {
    return this.#manifest;
  }
  set manifest(value) {
    this.#manifest = setOnce(this.#manifest, value, "manifest");
  }

  get db() {
    return this.#db;
  }
  set db(value) {
    this.#db = setOnce(this.#db, value, "db");
  }

  get game() {
    return this.#game;
  }
  set game(value) {
    this.#game = setOnce(this.#game, value, "game");
  }
}
