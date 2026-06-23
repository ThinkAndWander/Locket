import { system } from "./system"
import { stat } from "./stats"
import { skill } from './skills'
import { attribute } from './attributes'
import { pronounSet } from "./pronouns"

/** When most things change, these are re-evaluated and anything that would be triggered is then evaluated, in order.
 * This is used to simulate natural changes in emotion and other side effects.
*/
type triggers = {
    statChanges: { [key in keyof typeof stat]?: onTrigger }
    skillChanges: { [key in keyof typeof skill]?: onTrigger }
    attributeChanges: { [key in keyof typeof attribute]?: onTrigger }
    emotionChanges: { [key in keyof typeof emotion]?: onTrigger }
    personJoins: [headmate, onTrigger][]
    personLeaves: [headmate, onTrigger][]
    frontBlockedBy: [headmate, onTrigger][]
}

/** When an event would trigger, it only does so based on the trigger chance. If it does, then all other chances are
 * evaluated in a row. */
type onTrigger = {
    [key: number]: {
        /** Float 0-1. If this is set, a random number must beat or match it to resolve with effect. */
        chance?: number,

        /** Adds a modifier to the desire to front, clamped to fit 0-1 range. */
        frontModifier?: number

        /** Sets the headmate to fronting in all cases except if there is no fronting behavior. */
        forceFront?: boolean

        /** Stops fronting. If this leaves no fronting headmates, another is chosen by sensible criteria. */
        forceDormant?: boolean

        /** Adds a modifier to the given emotion, clamped to fit 0-1 range. */
        adjustMood: { [key in keyof typeof emotion]: number }
    }
}

/** How much the headmate wants or is willing to front is a factored decision. 0.5 is neutral. When this value >= 0.75,
 * the headmate would front. If 1, the headmate fronts unless they have no fronting behavior. If <= 0.25, the headmate
 * would stop fronting. If 0, the headmate immediately stops fronting and others are evaluated. */
type frontInterest = {
    /** A base interest in fronting as a value from 0-1. */
    desireToFront: number

    /** A modifier applied in special cases, such as when a headmate forcibly un-fronts another. */
    tempModifier: number

    /** Each hour, the temp modifier gets closer to zero by this value until it's 0. */
    tempRecovery: number

    /** Adds +desire when the given headmate is present, which includes external people's headmates. */
    headmateModifier: [number, headmate]

    /** [+desire, hours] such as [0.2, 1] meaning +0.2 desire to front each hour if not fronting. */
    impatienceModifier: [number, number]

    /** [+desire, hours] such as [-0.2, 1] meaning -0.2 desire to front each hour if fronting. */
    shynessModifier: [number, number]

    /** Adds +x desire to front when sufficiently sad, angry, etc. Usually a negative value. */
    negativeMoodModifier: number
}

/** Interactions with other headmates. */
type frontingInteraction = {
    /** Headmates need to meet the natural limit + this one to start fronting, if this one is active. */
    pushiness?: number

    /** When this one fronts, push others to stop fronting by resetting their fronting desire to 0.5 (unless it's 1). */
    othersStopFronting?: boolean

    /** Whether a headmate is revealed to the player. This represents the system's awareness. */
    declarePresence?: boolean
}

/** Numbers 0-1 representing % observed, % shared. */
type frontingPresence = {
    shareMood?: [number, number]
    shareAttributes?: [number, number]
    shareSkills?: [number, number]
    shareMemories?: [number, number]
}

/** A personality of the player. */
export type headmate = {
    system: system

    /** Determines the interest of body-attracted characters. This overlaps demeanor, so headmates can vary.
     * Any means body-attracted characters can be attracted to you across the masc-fem spectrum
     * None means NO body-attracted characters can be attracted to you. Good for ace playthrough
     * Masc/fem implies a masculine or feminine body, but does not imply its characteristics */
     bodyAttractPreference: "any" | "none" | "masc" | "fem"

     /** Determines how characters interact with the headmate when using gendered language:
      * - None: do NOT use gendered language. This is the default
      * - Match: "" use gendered language matching the body attract preference
      * - Masc and fem: use gendered language
      * 
      * None is like "hey!", masc is like "hey dude!", and fem is like "hey girl!" */
     genderedLanguagePreference: "none" | "match" | "masc" | "fem"

    /** What this headmate observes and shares internally. */
    frontPresence: frontingPresence

    /** How this headmate interacts with other headmates. */
    frontInteraction: frontingInteraction

    /** How much this headmate wants to be fronting, whether or not they are. */
    frontInterest: frontInterest

    /** An event-triggered system of responses that simulate changes in personality, attributes, fronting, etc. */
    reactions: triggers

    /** The name of this headmate. A singlet should always have a name. If undefined, the system name should be used,
     * and if undefined, "Player" should be used. */
    name: string | undefined

    /** A tagging system of changing effects, scoped to qualities. */
    attributes: (keyof typeof attribute)[]

    /** A tagging system of what has occurred, scoped to associations and events. */
    memories: memory[]

    /** Stats measuring changes in major spectrums, which can trigger changes in attributes. */
    stats: {[key in stat]: number}

    /** Identifies the pronoun set to use, or uses a custom one. Do not make associations between pronouns, gender, and
     * sex because they're not inherently related. Many players do not match them all. Pronouns can be changed to
     * support gender fluidity, genderqueer and similar needs. */
    pronouns: (pronounSet | [string, string, string, string, string])[]

    /** How pronouns are used, if used. Supports many common cases. Default is using pronouns. */
    pronounBehavior: "use pronouns" | "use name" | "cycle" | "randomize",

    /** How pronouns are used when referring to oneself. Singlets use singular pronoun behavior by default. Systems use
     * plural by default and may use singular as it makes sense contextually, unless always plural is chosen. If use
     * name is chosen for pronouns, it affects self pronouns too until changed. */
    selfPronounBehavior: "singular" | "use name" | "plural" | "always plural"

    /** Part of changing game data that identifies the current pronoun set to use, if alternation rules are in use. */
    pronounAlted: number
}