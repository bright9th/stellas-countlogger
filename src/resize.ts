import type { Game } from "./game";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "./shared/constants/canvas";

function init(game: Game) {
  function resize() {
    const scale = Math.min(
      window.innerWidth / DESIGN_WIDTH,
      window.innerHeight / DESIGN_HEIGHT
    );

    game.container.scale.set(scale);

    game.container.x = (window.innerWidth - DESIGN_WIDTH * scale) / 2;
    game.container.y = (window.innerHeight - DESIGN_HEIGHT * scale) / 2;
  }

  window.addEventListener("resize", resize);
  resize();
}

export default { init };
