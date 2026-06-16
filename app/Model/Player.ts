import { pronounSet } from "../localization/Pronouns"

export const trait = {
    // Traits in a spectrum. These are usually stat-tracking traits that influence other traits
    guarded: "guarded", open: "open",
    extrospective: "extrospective", introspective: "introspective",
    lowSelfEsteem: "lowSelfEsteem", selfLoving: "selfLoving",

    // Generally nice
    empathetic: "empathetic",

    // Generally problematic
    argumentative: "argumentative",
    materialistic: "materialistic",

    // Identity traits that can be written for w/o making the game uncomfy or too much work
    aromantic: "aromantic",

    // Derived exclusively from choices the player makes
    impairedMobility: "impairedMobility",
    impairedVision: "impairedVision"
}

type traitEntry = {
    name: string
    given?: (player: Player) => boolean
}
export function newTrait(name: string, given?: (player: Player) => boolean): traitEntry {
    return { name, given }
}

/** Static trait listings, not dependent on gameplay info. */
export const traitLookup: {[key in keyof typeof trait]: traitEntry} = {
    [trait.guarded]: newTrait("Guarded", (player: Player) => {
        return player.stats[Stat.Openness] <= -3
    }),
    [trait.open]: newTrait("Open", (player: Player) => {
        return player.stats[Stat.Openness] >= 3
    }),
    [trait.extrospective]: newTrait("Extrospective", (player: Player) => {
        return player.stats[Stat.Introspection] <= -3
    }),
    [trait.introspective]: newTrait("Introspective", (player: Player) => {
        return player.stats[Stat.Introspection] >= 3
    }),
    [trait.lowSelfEsteem]: newTrait("Low self esteem", (player: Player) => {
        return player.stats[Stat.SelfLove] <= -2
    }),
    [trait.selfLoving]: newTrait("Self-loving", (player: Player) => {
        return player.stats[Stat.SelfLove]
            + (player.traits.includes(trait.open) ? 1 : 0) >= 2
    }),
    [trait.argumentative]: newTrait("Argumentative", (player: Player) => {
        return player.stats[Stat.Argumentative]
            + (player.traits.includes(trait.extrospective) ? 1 : 0)
            + (player.traits.includes(trait.introspective) ? -1 : 0) >= 3
    }),
    [trait.materialistic]: newTrait("Materialistic"),
    [trait.empathetic]: newTrait("Empathetic"),
}

/** All stats by name. */
export const enum Stat {
    Openness,

    Introspection,

    SelfLove,

    Argumentative,

    /** Conscientiousness of the Big Five personality model. */
    SelfControl
}

/** All skills by name. */
export const enum Skill {
    SelfEducating,
    SelfReliant,
    FoodPrep,
    Caretaking,
}

type personality = {
    name: string
    traits: keyof typeof trait[]
    stats: {[key in Stat]: number}

    /**
     * Identifies the pronoun set to use, or uses a custom one. Do not make associations between pronouns, gender,
     * and sex because they're not inherently related. Many players do not match them all. Pronouns can be changed to
     * support gender fluidity, genderqueer and similar needs.
     */
    pronouns: (pronounSet | [string, string, string, string, string])[]

    /** How to use pronouns. Supports many common cases. */
    pronounBehavior: "use pronouns" | "use name" | "alternate she/he" | "alternate each",

    /** Part of changing game data that identifies the current pronoun set to use, if alternation rules are in use. */
    pronounAlted: number
}

/** A personality of the player. */
export type headmate = personality & {
    /**
     * How memory is shared between headmates.  
     * All: stat/trait changes are applied to this headmate regardless of which is fronting  
     * Some: stat/trait changes are applied to this headmate for notable events  
     * None: stat/trait changes are only applied to this headmate if they're fronting
     */
    memorySharing: "all" | "some" | "none"
}

/** The player. Assumes young and no major disabilities. Uses body type instead of gender. */
export type player = {
    /**
     * Player gender/preferences aren't codified into the game, but can be acted out to express them. So tracking the
     * body type exists for interactions with body-attracted people. "Any" is default, implying no interest to specify.
     */
    bodyType: "any" | "masc" | "fem" | "intersex"

    /**
     * The minds of the body, partial or fully separate. The personality associated at player level is the "main" personality.
     */
    headmates: headmate[]
    headmateSwitching: "at will" | "random"
}

export class Game {
    public players: player[] = []
}