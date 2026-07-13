import { newHeadmate } from "../core/model/headmates"
import { game } from "../core/model/model"
import { loadedLocalStorage, loadFromLocalStorage } from "../core/persistence"
import { initDisplay } from "../GUI/display"
import { initParsing, jumpToFork, separateIntoForks } from "../GUI/parser"
import { mainStory } from "../story.md"

/** The active game, including all options, fork details and player details. This is the running game; the static
 * content is stored in various files such as story.md and the app/story folder. */
let game: game | undefined
let hasEverRanInit = false

export function init(): void {
    if (hasEverRanInit) { return }
    hasEverRanInit = true

    // Keep this call first
    loadFromLocalStorage()

    // Initializes the game
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
                descriptors: [],
                contentRaw: ''
            },
            links: [],
            forks: []
        },
        appOptions: {
            blockedTriggers: [],
            fontScaling: 1,
            volumes: [1, 1, 1, 1],
            noAnimation: false
        },
        gameOptions: {},
        log: []
    }

    // Adds a player, then initializes both parser and display
    game.player.system.headmates.push(newHeadmate(game.player.system))
    initParsing(game)
    initDisplay()

    // Pre-parses the main story into its forks and sets the active fork.
    game.story.forks = separateIntoForks(game, mainStory)

    if (game.story.forks.length > 0) {
        jumpToFork(game, game.story.forks[0])
    }
}