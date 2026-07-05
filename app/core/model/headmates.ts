import { headmate, frontingPresenceType, stat, system } from "./model"

/** Returns 1 if a headmate should be fronting, 0 if neutral, -1 if they shouldn't. */
export function isFronting(headmate: headmate): number {
    return headmate.frontFactor.desireToFront >= 0.75 ? 1
        : headmate.frontFactor.desireToFront <= 0.25 ? -1 : 0
}

/** Calculates the current fronting interest for the given headmate, taking into consideration all others present. */
export function getFrontingInterest(headmate: headmate, allOthers: headmate[]): number {
    let amount = headmate.frontFactor.desireToFront
        + headmate.frontFactor.negativeEmotionModifier
        + headmate.frontFactor.positiveEmotionModifier
        + headmate.frontFactor.tempModifier

    for (const entry of headmate.frontFactor.headmateModifier) {
        if (allOthers.includes(entry[1])) {
            amount += entry[0]
        }
    }

    return amount
}

/** Optional utility to create a headmate (since it's such a large object). */
export function newHeadmate(system: system): headmate {
    return {
        attributes: [],
        bodyAttractPreference: 'any',
        genderedLanguagePreference: 'match',
        frontFactor: {
            desireToFront: 1,
            headmateModifier: [],
            impatienceModifier: [0, 0],
            negativeEmotionModifier: 0,
            positiveEmotionModifier: 0,
            tempModifier: 0,
            tempRecovery: 0
        },
        frontPresence: {
            shareAttributes: [1, true, 1],
            shareMemories: [1, true],
            shareMood: [1, 1],
            shareSkills: [1, true],
            declarePresence: frontingPresenceType.Known,
        },
        memories: [],
        name: undefined,
        pronounAlted: 0,
        pronounBehavior: "use pronouns",
        pronouns: ["they"],
        selfPronounBehavior: "singular",
        reactions: {
            statChanges: {},
            attributeChanges: {},
            emotionChanges: {},
            frontBlockedBy: [],
            personJoins: [],
            personLeaves: [],
            skillChanges: {}
        },
        stats: {
            [stat.emotionalOpenness]: 0,
            [stat.emotionalListening]: 0,
            [stat.introspection]: 0,
            [stat.assertiveness]: 0,
            [stat.empathy]: 0,
        },
        system: system
    }
}