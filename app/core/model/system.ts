import { isFronting, newHeadmate } from "./headmates"
import { attribute, headmate, frontingPresenceType, stat, system } from "./model"
import { pronouns } from "./placeholders"

/** Returns the number of fronting headmates (anonymous and known), and all known headmates. */
export function getFronters(character: system): { headmates: headmate[], count: number } {
    const headmates: headmate[] = []
    let count = 0

    for (const headmate of character.headmates) {
        if (isFronting(headmate)) {
            if (headmate.frontPresence.declarePresence === frontingPresenceType.Known) {
                headmates.push(headmate)
                count++
            } else if (headmate.frontPresence.declarePresence === frontingPresenceType.Anonymous) {
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
            if (headmate.frontPresence.declarePresence === frontingPresenceType.Anonymous ||
                headmate.frontPresence.declarePresence === frontingPresenceType.Known)
            {
                presentCount++
                if (presentCount === 1) {
                    combined.pronounBehavior = headmate.pronounBehavior
                    combined.pronouns1P = headmate.pronouns1P
                    combined.pronouns3P.concat(headmate.pronouns3P)
                    combined.name = headmate.name
                } else if (presentCount === 2) {
                    combined.pronounBehavior = 'use name'
                    combined.pronouns1P = 'always plural'
                    combined.pronouns3P = [pronouns.they]
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