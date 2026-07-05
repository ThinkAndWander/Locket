import { attribute, attributeEntry, headmate, stat } from "./model"

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