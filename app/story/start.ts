import { newHeadmate } from "../core/model/headmates"
import { loadedLocalStorage, loadFromLocalStorage } from "../core/persistence"
import { initDisplay } from "../GUI/display"
import { game } from "../core/model/model"

/** The active game, including all options, fork details and player details. This is the running game; the static
 * content is stored in various files such as story.md and the app/story folder. */
let game: game | undefined

export function init(): void {

    loadFromLocalStorage() // Keep this call first
    initDisplay()

    // Initializes the game.
    game = {
        player: {
            milestones: loadedLocalStorage.milestones,
            system: {
                headmates: [],
                systemName: undefined
            },
            hoursAwake: 0,
            mentalEnergy: 0,
            physicalEnergy: 0,
            socialEnergy: 0
        },
        hourTotal: 0,
        story: {
            fork: {
                name: '',
                links: [],
                arguments: [],
                contents: ''
            },
            forkOptions: []
        },
        appOptions: {
            blockedTriggers: [],
            fontScaling: 1,
            volumes: [1, 1, 1, 1],
            noAnimation: false
        },
        gameOptions: {}
    }

    game.player.system.headmates.push(newHeadmate(game.player.system))

    // Parse the story for display.
    // The parser should expose this and we call it here. TODO
}