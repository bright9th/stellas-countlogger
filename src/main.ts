import "./style/index.css";
import { Game } from "./game";
import resize from "./resize";
const game = new Game();
await game.init();
document.body.appendChild(game.app.canvas);
resize.init(game);
