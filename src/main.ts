import "./style/index.css";
import globals from "./shared/components/globals";
import { Game } from "./game";
import resize from "./resize";

const game = new Game();
await game.init();
document.body.appendChild(game.app.canvas);
resize.init(game);

await globals.init();
globalThis.App.game = game;
game.start();
