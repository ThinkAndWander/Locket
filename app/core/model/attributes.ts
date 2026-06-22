import { strings } from "../localization.ts"
import { headmate } from "./headmates.ts"
import { stat } from "./stats.ts"

/** Attributes are given, or derived from stats. Storywriting should use this if possible. */
export const enum attribute {
    guarded = 0, open = 1,
    extrospective = 2, introspective = 3,
    lowSelfEsteem = 4, selfLoving = 5,

    dietNoRedMeat = 6,
    dietVegetarian = 7,
    dietVegan = 8,

    empathetic = 9,
    argumentative = 10,
    materialistic = 11
}

type attributeEntry = { name: string, assign?: (all: headmate) => boolean }

/** Static trait listings, not mutated with gameplay state. */
export const attributesLookup: {[key in keyof typeof attribute]: attributeEntry} = {
    [attribute.guarded]: { name: strings.Attributes.SelfLoving, assign: (all: headmate) => {
        // TODO: get a unified read of stats. Define it on the system!
        return all.stats[stat.openness] <= -3
    }},
    [attribute.open]: newTrait("Open", (mate: headmate) => {
        return mate.stats[stat.openness] >= 3
    }),
    [attribute.extrospective]: newTrait("Extrospective", (mate: headmate) => {
        return mate.stats[stat.introspection] <= -3
    }),
    [attribute.introspective]: newTrait("Introspective", (mate: headmate) => {
        return mate.stats[stat.introspection] >= 3
    }),
    [attribute.lowSelfEsteem]: newTrait("Low self esteem", (mate: headmate) => {
        return mate.stats[stat.selfLove] <= -2
    }),
    [attribute.selfLoving]: newTrait("Self-loving", (mate: headmate) => {
        return mate.stats[stat.selfLove]
            + (mate.traits.includes(attribute.guarded) ? 1 : 0) >= 2
    }),
    [attribute.argumentative]: newTrait("Argumentative", (mate: headmate) => {
        return mate.stats[stat.argumentative]
            + (mate.traits.includes(attribute.extrospective) ? 1 : 0)
            + (mate.traits.includes(attribute.introspective) ? -1 : 0) >= 3
    }),
    [attribute.materialistic]: newTrait("Materialistic"),
    [attribute.empathetic]: newTrait("Empathetic"),
    [attribute.dietNoRedMeat]: newTrait("Avoids red meat"),
    [attribute.dietVegan]: newTrait("Vegan"),
    [attribute.dietVegetarian]: newTrait("Vegetarian"),
}