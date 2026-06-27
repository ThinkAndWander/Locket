// TODO: handle new, load, open at the start of the game.

import { newHeadmate } from "../core/model/headmates"
import { system } from "../core/model/system"
import { loadFromLocalStorage } from "../core/persistence"
import { initDisplay } from "../GUI/display"

export function init(): void {

    debugger
    loadFromLocalStorage() // Keep this call first
    initDisplay()

    const player: system = {
        headmates: [],
        systemName: undefined
    }

    player.headmates.push(newHeadmate(player))
}