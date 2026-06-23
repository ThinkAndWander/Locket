import { headmate } from "./headmates"

/** Any character, single or plural. */
export type system = {
    /** The minds of the body, partial or fully separate. The personality associated at player level is the "main"
     * personality. The first headmate is the starting assumed headmate. There must always be at least one. */
    headmates: headmate[]

    /** A collective name for the system. For non-plural players, this is used first, fallbacking to the first
     * headmate's name. */
    systemName: string | undefined
}

/** Returns a headmate object composed of all the effects of a system's fronting headmates. */
export function getCombinedIdentity(character: system): headmate {
    const combinedStats: (string | number | symbol)[] = []
    const combinedTraits: (string | number | symbol)[] = []
    const combinedMemories: (string | number | symbol)[] = []
    for (let headmate of character.headmates) {
        combinedTraits.concat(headmate.attributes)
        combinedMemories.concat(headmate.memories)
    }

    // TODO: correct this later.
    return {
        acting: "",
        bodyAttractPreference: "any",
        genderedLanguagePreference: "fem",
        listening: "all",
        memories: combinedMemories,
        name: "",
        pronounAlted: 0,
        pronounBehavior: "cycle",
        pronouns: [],
        selfPronounBehavior: "always plural",
        stats: combinedStats,
        switchRuleset: undefined,
        system: character,
        attributes: combinedTraits
    }
}