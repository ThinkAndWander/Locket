import { game } from "./model"

/** Process all game changes that occur hourly. */
export function tick(game: game): void {
    game.hourTotal++
}