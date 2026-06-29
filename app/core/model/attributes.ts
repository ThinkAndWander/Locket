import { headmate } from "./headmates"
import { stat } from "./stats"

/** Attributes are given, or derived from stats. Storywriting should use this if possible. */
export const enum attribute {
    /** Low emotional openness. */
    guarded = 0,
    /** High emotional openness. */
    overshareProne = 1,
    /** Low emotional listening. */
    stubborn = 2,
    /** High emotional listening, implying ability to quickly change (not the same as gullible). */
    amenable = 3,
    /** High introspection.  */
    introspective = 4,
    /** Low assertion. */
    passive = 5,
    /** High assertion. */
    assertive = 6,
    /** Low empathy. Not the same as disregard and coldness. */
    calculated = 7,
    /** High empathy. Not the same as emotional or rash. */
    empathetic = 8,
    /** For those who want to abstain digitally as well. */
    dietVegetarian = 9,
    /** For those who want to abstain digitally as well. */
    dietVegan = 10,
}

type attributeEntry = { name: string, assign?: (unified: headmate) => boolean }

/** Static traits and qualities a headmate can have, not mutated with gameplay state. */
export const attributesLookup: {[key in keyof typeof attribute]: attributeEntry} = {
    'guarded': { name: "Guarded", assign: (unified: headmate) => {
        return unified.stats[stat.emotionalOpenness] <= -3
    }},
    'overshareProne': { name: "Overshare prone", assign: (unified: headmate) => {
        return unified.stats[stat.emotionalOpenness] >= 3
    }},
    'stubborn': { name: "Stubborn", assign: (unified: headmate) => {
        return unified.stats[stat.emotionalListening] <= -3
    }},
    'amenable': { name: "Amenable", assign: (unified: headmate) => {
        return unified.stats[stat.emotionalListening] >= 3
    }},
    'introspective': { name: "Introspective", assign: (unified: headmate) => {
        return unified.stats[stat.introspection] >= 3
    }},
    'passive': { name: "Passive", assign: (unified: headmate) => {
        return unified.stats[stat.assertiveness] <= -3
    }},
    'assertive': { name: "Assertive", assign: (unified: headmate) => {
        return unified.stats[stat.assertiveness] >= 3
    }},
    'calculated': { name: "Calculated", assign: (unified: headmate) => {
        return unified.stats[stat.empathy] <= -3
    }},
    'empathetic': { name: "Empathetic", assign: (unified: headmate) => {
        return unified.stats[stat.empathy] >= 3
    }},
    'dietVegetarian': { name: "Vegetarian" },
    'dietVegan': { name: "Vegan" },
}