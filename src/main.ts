import "./style/index.css";
import { initDevtools } from "@pixi/devtools";
import globals from "./shared/components/globals";
import { Game } from "./game";
import resize from "./resize";

const game = new Game();
await game.init();
document.body.appendChild(game.app.canvas);
void initDevtools({
  app: game.app,
});
resize.init(game);

await globals.init();
globalThis.App.game = game;
game.start();
