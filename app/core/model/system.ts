import { attribute } from "./attributes"
import { headmate, isFronting, newHeadmate, presence } from "./headmates"
import { pronouns } from "./pronouns"
import { stat } from "./stats"

/** Any character, single or plural. */
export type system = {
    /** The minds of the body, partial or fully separate. The personality associated at player level is the "main"
     * personality. The first headmate is the starting assumed headmate. There must always be at least one. */
    headmates: headmate[]

    /** A collective name for the system. For non-plural players, this is used first, fallbacking to the first
     * headmate's name. */
    systemName: string | undefined
}

/** Returns the number of fronting headmates (anonymous and known), and all known headmates. */
export function getFronters(character: system): { headmates: headmate[], count: number } {
    const headmates: headmate[] = []
    let count = 0

    for (const headmate of character.headmates) {
        if (isFronting(headmate)) {
            if (headmate.frontPresence.declarePresence === presence.Known) {
                headmates.push(headmate)
                count++
            } else if (headmate.frontPresence.declarePresence === presence.Anonymous) {
                count++
            }
        }
    }

    return { headmates, count }
}

/**
 * Returns a headmate object composed of all the effects of a system's fronting headmates.
 * There is no fronting interest defined for the combination of headmates.
*/
export function getCombinedIdentity(character: system): headmate {
    const combined = newHeadmate(character)

    let presentCount = 0, noneCount = 0, mascCount = 0, femCount = 0;
    for (const headmate of character.headmates) {
        if (isFronting(headmate)) {
            if (headmate.frontPresence.declarePresence === presence.Anonymous ||
                headmate.frontPresence.declarePresence === presence.Known)
            {
                presentCount++
                if (presentCount === 1) {
                    combined.pronounBehavior = headmate.pronounBehavior
                    combined.selfPronounBehavior = headmate.selfPronounBehavior
                    combined.pronouns.concat(headmate.pronouns)
                    combined.name = headmate.name
                } else if (presentCount === 2) {
                    combined.pronounBehavior = 'use name'
                    combined.selfPronounBehavior = 'always plural'
                    combined.pronouns = [pronouns.they]
                    combined.name = undefined
                }
            }
            
            if (headmate.frontPresence.shareAttributes) {
                if (headmate.frontPresence.shareAttributes[1]) {
                    for (const attr in headmate.attributes) {
                        if (!combined.attributes.includes(attr as keyof typeof attribute)) {
                            combined.attributes.push(attr as keyof typeof attribute)
                        }
                    }
                }

                const percent = headmate.frontPresence.shareAttributes[2]
                combined.stats[stat.emotionalOpenness] += percent * headmate.stats[stat.emotionalOpenness]
                combined.stats[stat.emotionalListening] += percent * headmate.stats[stat.emotionalListening]
                combined.stats[stat.introspection] += percent * headmate.stats[stat.introspection]
                combined.stats[stat.assertiveness] += percent * headmate.stats[stat.assertiveness]
                combined.stats[stat.empathy] += percent * headmate.stats[stat.empathy]
            }

            if (headmate.frontPresence.shareMemories && headmate.frontPresence.shareMemories[1]) {
                combined.memories.concat(headmate.memories)
            }

            // Determine mixed headmate preferences. "None" takes precedence, and mixed becomes any.
            switch (headmate.bodyAttractPreference) {
                case 'any': break
                case 'fem': femCount++; break
                case 'masc': mascCount++; break
                case 'none': noneCount++; break
                default: headmate.bodyAttractPreference satisfies never // TS catch missing cases
            }

            if (noneCount > 0) {
                combined.bodyAttractPreference = 'none'
                combined.genderedLanguagePreference = 'none'
            } else if (femCount > 0 && mascCount > 0) {
                combined.bodyAttractPreference = 'any'
                combined.genderedLanguagePreference = 'none'
            } else if (femCount > 0) {
                combined.bodyAttractPreference = 'fem'
                combined.genderedLanguagePreference = 'match'
            } else if (mascCount > 0) {
                combined.bodyAttractPreference = 'masc'
                combined.genderedLanguagePreference = 'match'
            }
        }
    }

    return combined
}