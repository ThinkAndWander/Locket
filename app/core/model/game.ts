import { milestone } from "./milestones";
import { system } from "./system";

/** App-wide options regardless of what players, characters, or anything. */
export type applicationOptions = {
    /** Master, music, sfx, voice. Each is a number from 0 to 1 where 1 is full volume. */
    volumes: [number, number, number, number]

    /** Stops animation if set to false. Undefined reads the browser's reduced motion preference. */
    noAnimation?: boolean

    /** A multiplier for text size, for visual ease. */
    fontScaling: number
}

/** Game-wide options that are associated to one game. */
export type gameOptions = {
    /** Default 90. */
    daysInASeason: number
}

/** A player and their metadata. */
export type player = {
    /** The player's self and their stats. */
    system: system

    /** Achievements the player has accomplished. */
    milestones: milestone[]

    /** Physical energy is used to perform exertive tasks. Nearly/fully draining it affects mental energy for the day
     * and results in slightly less physical energy after next rest. */
    physicalEnergy: number

    /** The executive function a player has. At zero, the player can't do anything else costing energy. */
    mentalEnergy: number

    /** The player's "spoons" for talking. Nearly/fully draining it affects mental energy for the day and results in
     * slightly less social energy after next rest. */
    socialEnergy: number

    /** Resets when the player sleeps, and subtracts 3 on first nap and 1 on the next nap. At above 16, all energy
     * costs are higher. */
    hoursAwake: number
}

/** An instance of a loaded, running game. */
export type game = {
    player: player

    /** This is all hours since the start of the game. */
    hourTotal: number

    /** The lowercased fork name corresponding to the currently-loaded fork. */
    currentFork: string
}

/** Process all game changes that occur hourly. */
export function tick(game: game): void {
    game.hourTotal++
}