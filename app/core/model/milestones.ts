/** Milestones */
export type milestone = {
    title: string
    description: string

    /** Tracks the first to achieve a milestone.
     * "{number} members of {system}" if a plural player with multiple fronting headmates discovered it
     * "{name} of {system}" if a plural player with 1 fronting headmate discovered it
     * "{system}" if a system name exists regardless of plurality
     * "{headmate 1}" if a non-plural player discovered it and there's no system name
     * "Player" if nothing else is found
     */
    discoveredBy?: string

    /** Spoilers are hidden, but can be revealed at-will. */
    spoiler?: boolean
}

/** Add game-wide achievements here. These are awarded arbitrarily. */
export type milestoneLookup = {
    twoYearsPassed: milestone
}
