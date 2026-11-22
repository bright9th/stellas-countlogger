// import "./style/index.css";
// import { Game } from "./game";
// import resize from "./resize";
// const game = new Game();
// await game.init();
// document.body.appendChild(game.app.canvas);
// resize.init(game);

// TODO This is test only. Remove code below and uncomment above.
import globals from "./shared/components/globals";
await globals.init();

const result = await globalThis.App.db!.connection.query(`
  SELECT *
  FROM read_parquet('messages.parquet')
  LIMIT 1000
`);

const rows = result.toArray().map((row) => row.toJSON());
console.log(rows);
