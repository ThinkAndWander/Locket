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
    system: system
    milestones: milestone[]
}

/** An instance of a loaded, running game. */
export type game = {
    players: player[]

    /** This is all hours since the start of the game. */
    hourTotal: number
}

/** Process all game changes that occur hourly. */
export function tick(game: game): void {
    // TODO: Connect to a global hours counter and so on.
    game.hourTotal++
}