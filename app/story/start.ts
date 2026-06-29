import { newHeadmate } from "../core/model/headmates"
import { loadFromLocalStorage } from "../core/persistence"
import { initDisplay, outputHTML } from "../GUI/display"
import { game } from "../core/model/game"

export function init(): void {

    loadFromLocalStorage() // Keep this call first
    initDisplay()

    // Initializes the game.
    const game: game = {
        player: {
            milestones: [],
            system: {
                headmates: [],
                systemName: undefined
            }
        },
        hourTotal: 0
    }

    game.player.system.headmates.push(newHeadmate(game.player.system))

    // Parse the story for display.
    // The parser should expose this and we call it here. TODO
}