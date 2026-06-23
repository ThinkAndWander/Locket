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
export type character = {
    system: system
    milestones: milestone[]
}

const enum season {
    winter = 0, spring = 1, summer = 2, fall = 3
}

/** An instance of a loaded, running game. */
export type game = {
    players: system[]

    /** Season duration is a player option. */
    season: season

    /** The first day is day 1. Whole number. */
    day: number

    /** Hours can be fractional and go up to 24. */
    hour: number
}