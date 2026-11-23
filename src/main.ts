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

const result = await globalThis.App.db!.query({
  queryType: "get_modulo_id_rows",
  params: {
    table_name: "messages",
    modulo: 67,
    limit: 69,
  },
});

console.log(result);
