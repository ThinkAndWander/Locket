import { pronounSet } from "./placeholders"

//#region headmate variables
/** Memories are events and associations. */
export type memory = {
    /** The headmates that the memory is about. Emotions here may color interactions with them. Self memories will list
     * only the headmate that owns the memory, and emotions will not apply. */
    about: headmate[]

    /** Timestamped to the nearest hour. */
    totalHour: number

    /** Associated emotion and its modifier, decay per hour, and minimum value. */
    emotions?: [emotion, number, number, number][]
}

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

/** Attribute entries in a lookup are named and have a callback to perform automatic de/assignment for a headmate. */
export type attributeEntry = { name: string, assign?: (unified: headmate) => boolean }

/** Emotions are a measurement of quickly-changing effects. They work like stats, but are treated differently in how
 * headmates can share them. */
export const enum emotion {
    /** Includes many complex positive emotions. */
    happy = 0,

    /** Includes some negative emotions. */
    sad = 1,

    /** Includes many complex negative emotions. */
    upset = 2
}

/** Named skills. */
export const enum skill {
    selfEducating = 0,
    selfReliant = 1,
    foodPrep = 2,
    caretaking = 3,
    signLanguage = 4
}

/** A personality stat system is used so that most actions in game can have cumlative consequences that affect
 * future encounters. Meyers-Briggs, Big Five (OCEAN) and HEXACO systems don’t lend to quantitative needs and
 * generally don’t combine well, so these are based on a Self vs. Not-self ("World") system.
 * 
 * Nothing is really this binary and most of all, it's very compartmentalized in the real world (lingering emotions for
 * just one person, for example) because the mind is a neural net. Everything here is generally good and bad, with
 * nuanced side effects. For example, being self-aware is the basis for severe overthinking and self hate as well as
 * self love and increasing other stats. Complexities like the accuracy of reviewing and taking in new thoughts are
 * part of metacognition and not easily represented in this game.
 * */
export const enum stat {
    /** Giving input of the Self to World.
     * A spectrum from being shut off to oversharing (potentially making yourself vulnerable). */
    emotionalOpenness = 0,

    /** Taking input from the World. 
     * A spectrum from stubborn to amenable. */
    emotionalListening = 1,

    /** Self awareness.
     * This is not a spectrum, but it affects mental growth and what some attributes in combination mean. */
    introspection = 2,

    /** Changing World based on Self and not changing Self based on World.
     * A spectrum from accepting fate to asserting opinion over others. */
    assertiveness = 3,

    /** Changing emotional state based on World.
     * A spectrum from callousness to feeling everything. */
    empathy = 4
}
//#endregion

//#region headmate interaction
/** How much the headmate wants or is willing to front is a factored decision. 0.5 is neutral. When this value >= 0.75,
 * the headmate would front. If 1, the headmate fronts unless they have no fronting behavior. If <= 0.25, the headmate
 * would stop fronting. If 0, the headmate immediately stops fronting and others are evaluated. */
type frontingFactor = {
    /** A base interest in fronting as a value from 0-1. */
    desireToFront: number

    /** A modifier applied in special cases, such as when a headmate forcibly un-fronts another. */
    tempModifier: number

    /** Each hour, the temp modifier gets closer to zero by this value until it's 0. */
    tempRecovery: number

    /** Adds +desire when the given headmate is present, which includes external people's headmates. */
    headmateModifier: [number, headmate][]

    /** [+desire, hours] such as [0.2, 1] meaning +0.2 desire to front each hour if not fronting. */
    impatienceModifier: [number, number]

    /** Adds +x desire to front when sufficiently happy (or other positive emotions). */
    positiveEmotionModifier: number

    /** Adds +x desire to front when sufficiently sad, angry, etc. Usually a negative value. */
    negativeEmotionModifier: number
}

/** Types of presence. */
export const enum frontingPresenceType {
    /** Doesn't affect the headmate count or reveal presence, or trigger headmate-specific events. */
    Hidden = 0,

    /** Affects the headmate count, but does not trigger headmate-specific events or reveal to the player. */
    Anonymous = 1,

    /** Affects both the count of headmates and reveals who to the player. */
    Known = 2
}

/** Interactions with other headmates. */
type frontingPresence = {
    /** Numbers 0-1 to observe and share mood (mixes by percent). */
    shareMood?: [number, number]

    /** Number 0-1 to observe stats. Bool to share attributes or not. Number 0-1 to mix stats by %. */
    shareAttributes?: [number, boolean, number]

    /** A number 0-1 to observe and boolean to share skills or not. */
    shareSkills?: [number, boolean]

    /** A number 0-1 to observe and boolean to share memories or not. */
    shareMemories?: [number, boolean]

    /** When this headmate fronts, applies a negative modifier to the currently-fronting to cause them to stop. When
     * multiple are pushy like this, the suppression applies to all and at least 1 headmate will remain fronting. */
    suppressFronting?: number

    /** Whether a headmate is revealed to the player. This represents the system's awareness. */
    declarePresence?: frontingPresenceType
}
//#endregion

//#region headmates and systems
/** Headmate variables (stats, attributes, memories, etc.) are *what* changes. This is *how* those changes produce an
 * effect. When things change, these are re-evaluated and what would be triggered is evaluated, in order. */
type reaction = {
    statChanges: { [key in keyof typeof stat]?: onReact }
    skillChanges: { [key in keyof typeof skill]?: onReact }
    attributeChanges: { [key in keyof typeof attribute]?: onReact }
    emotionChanges: { [key in keyof typeof emotion]?: onReact }
    personJoins: [headmate, onReact][]
    personLeaves: [headmate, onReact][]
    frontBlockedBy: [headmate, onReact][]
}

/** When a reaction is triggered, this defines the side effects of it. If a trigger chance is defined, then it will
 * skip having an effect if random() < that chance. */
type onReact = {
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

/** The whole (or part) of a person's mental state. Singlets are people who have one unified conscience. A plural
 * person has any number of minds with varying degrees of separation, presence, inner interactivity to each other, and
 * origin. These are called headmates and this game uses it for all characters.
 * Reference: https://pluralpedia.org/w/System */
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

    /** How much this headmate wants to be fronting, whether or not they are. */
    frontFactor: frontingFactor

    /** An event-triggered system of responses that simulate changes in personality, attributes, fronting, etc. */
    reactions: reaction

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
    pronouns3P: (pronounSet | [string, string, string, string, string])[]

    /** How pronouns are used when referring to oneself. Singlets use singular pronoun behavior by default. Systems use
     * plural by default and may use singular as it makes sense contextually, unless always plural is chosen. If use
     * name is chosen for pronouns, it affects self pronouns too until changed. */
    pronouns1P: "singular" | "use name" | "plural" | "always plural"

    /** By default, headmates are referred to by their first chosen pronoun. Alternatively, they can be referred to by
     * their name, in which case the system name is preferred when multiple headmates are fronting. Cycling to the next
     * pronoun each time it's called for is also an option, as is randomly picking (can pick the same in a row too). */
    pronounBehavior: "use pronouns" | "use name" | "cycle" | "randomize",

    /** Part of changing game data that identifies the current pronoun set to use, if alternation rules are in use. */
    pronounAlted: number
}

/** Any person, single or plural. */
export type system = {
    /** The minds of the body, partial or fully separate. The personality associated at player level is the "main"
     * personality. The first headmate is the starting assumed headmate. There must always be at least one. */
    headmates: headmate[]

    /** A collective name for the system. For non-plural players, this is used first, fallbacking to the first
     * headmate's name. */
    systemName: string | undefined
}

/** An entry in the character definitions in characters.ts. */
export type character = { self: system, id: number }
//#endregion

//#region Player and game state
/** Options across the app, mostly about usage and settings like volume. */
export type appOptions = {
    /** Global, music, sfx, voice. Each is a number from 0 to 1 where 1 is full volume. */
    volumes: [number, number, number, number]

    /** Stops animation if set to false. Undefined reads the browser's reduced motion preference. */
    noAnimation?: boolean

    /** A multiplier for text size, for visual ease. */
    fontScaling: number

    /** Subjects that a player may detest, be uncomfortable around or feel threatened by. Blocking a trigger makes its
     * warning more prominent and hides the associated text so that you need to manually show it. */
    blockedTriggers: reaction[]

    /** We can produce screen reader-specific text, and does so, in cases where it would improve the
     * flow of speech. This usually beats what narration would produce today. See writing guidelines in WRITING.md. */
    disableTTSOptimization?: boolean
}

/** Options to affect gameplay mechanics. */
export type gameOptions = {
    
}

/** A player and their metadata. */
export type player = {
    /** The player's self and their stats. */
    system: system

    /** Achievements the player has accomplished. */
    milestones: milestone[]

    /** Physical energy is used to perform exertive tasks. Nearly/fully draining it affects mental energy for the day
     * and results in slightly less physical energy after next rest. */
    physicalEnergy: number

    /** The executive function a player has. At zero, the player can't do anything else costing energy. Nothing costs
     * mental energy directly. */
    mentalEnergy: number

    /** The player's "spoons" for talking. Nearly/fully draining it affects mental energy for the day and results in
     * slightly less social energy after next rest. */
    socialEnergy: number

    /** Resets when the player sleeps, and subtracts 3 on first nap and 1 on the next nap. At above 16, all energy
     * costs are higher. */
    hoursAwake: number
}

/** An instance of a loaded, running game. */
export type game = {
    player: player

    /** This is all hours since the start of the game. */
    hourTotal: number

    /** Options to change gameplay. */
    gameOptions: gameOptions

    /** Options across the app, mostly about usage and settings like volume. */
    appOptions: appOptions

    /** The story branching state of data. */
    story: {
        fork: fork,
        links: forkLink[],
        forks: fork[]
    }

    /** A log of unexpected warnings and errors produced by the game parser or elsewhere. */
    log: log[]

    /** Story code might like a place to define vars, and this helps it do so without writing const, due to how
     * object properties work. Making it explicit also makes it easier to track and lets us say "if it's not defined
     * here, there are no guarantees about it". One of those guarantees is functions: we can't save functions, but if
     * we can at least expect and programmatically find them here, we can stringify them and reconstitute it later.
     * Like all story code, it's not XSS safe. */
    codecontext: {}
}

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
//#endregion

//#region time
/** Names of seasons in the game. Each month is 30 days, so each season is 90 days. */
export const enum season {
    winter = 0, spring = 1, summer = 2, fall = 3
}

/** Units of time (serialize as hours instead; do not use other units). */
export const enum timeUnit {
    hours, day, dayInWeek, month, monthInYear, season, year
}
//#endregion

//#region story state and utilities
/** A top-level token, sorted before anything else in the story text. See WRITING.md. */
export type fork = {
    /** A unique, lowercased and trimmed fork name of \w word characters. */
    name: string,

    /** Raw fork contents. */
    contentRaw: string,

    /** Fork contents after placeholder injection. */
    contentParsed?: string,

    /** Additional, case-sensitive info associated to the fork. See WRITING.md. */
    descriptors: forkDescriptors[]
}

/** The possible names of fork descriptors. Trimmed lowercase. See WRITING.md. */
export const enum forkDescriptorName {
    People = 'people',
    Time = 'time',
    Trigger = 'trigger',
}

/** The definitions of fork descriptors. Trimmed lowercase. See WRITING.md. */
export type forkDescriptors = 
    { name: forkDescriptorName.People, character: character, headmate?: headmate } |
    { name: forkDescriptorName.Time, amount: number, unit: 'minutes' | 'hours' } |
    { name: forkDescriptorName.Trigger, triggers: triggerWarning[] }

/** Information for a clickable link to hyperlink to a different story section. */
export type forkLink = {
    /** The lowercased trimmed fork name. */
    name: string,
    
    /** The text displayed for the link. */
    text: string,

    /** Options affecting a fork link, such as energy costs. */
    descriptors: linkDescriptors[],
}

/** The possible names of fork link descriptors. See WRITING.md. */
export const enum linkDescriptorName {
    Social = 'social',
    Physical = 'physical',
    Mental = 'mental'
}

/** The definitions of fork link descriptors. See WRITING.md. */
export type linkDescriptors =
    { name: linkDescriptorName.Social, amount: number } |
    { name: linkDescriptorName.Physical, amount: number } |
    { name: linkDescriptorName.Mental, amount: number }

/** Tags used to indicate possible triggering content. If this list is extended, please review the existing storyline
 * and retroactively tag things as appropriate. */
export const enum triggerWarning {
    /** Implying judgment or categorical preference. "That girl is so skinny, is she anorexic?" */
    BodyShaming = 'body shaming',

    /** Moving through or describing tight corridors. "The bus is cramped. All you see are shoulders" */
    Claustrophobia = 'claustrophobia',

    /** Includes nest and web descriptions. "Do you want to see my pet spider?" */
    Arachnophobia = 'arachnophobia',

    /** Can cause players to think about and be dysphoric. "I wish I could be myself in public" */
    Dysphoria = 'dysphoria',

    /** Includes harm, guts/blood, dead stuff, yelling and fighting. "There is a mounted wolf head on the wall" */
    Violence = 'violence',

    /** Assumed culture, not applied intolerance (which is disallowed). "When are you getting married?" */
    LifestyleAssumption = 'lifestyle assumption',

    /** Some players have experienced or known someone homeless. "Our car passed a few tents on the road." */
    HomelessHardship = 'homeless hardship'
}

/** A very simple log definition to jot down errors and warnings during parsing, for developer convenience. */
export type log = {
    text: string,
    type: 'warn' | 'err'
}
//#endregion

//#region Theme
type themeName = { name: string }
/** Provides the basic colors and contrast of base themes. */
export type theme = themeName & {
    /** Color of buttons, like fork links. */
    control: string

    /** Color of interactive controls when disabled (defaults to non-disabled look). Note usually it's not provided
     * because we prefer to use the 🛇 symbol for active accessibility. Current patterns are not good enough. */
    controlDisabled?: string

    /** Color of interactive control text when disabled. Usually not provided. */
    controlDisabledText?: string

    /** Color of interactive controls when focused. */
    controlFocus: string

    /** Color of interactive control text (defaults to the general text color). */
    controlText?: string

    /** Color of the reading column. */
    column?: string

    /** Color of the focus rectangle applied to elements for keyboard navigation. */
    focusBorder: string

    /** Color of the header at top. */
    header: string

    /** Color of the screen. */
    page: string

    /** Color of most text. */
    text: string

    /** Color of any link. */
    link: string

    /** Browsers might not respect styling of :visited, due to anti-tracking efforts. Defaults to link color. */
    linkVisited?: string
}

/** Themes can be based on these, and themes based on these will mix in those ones. */
export const enum themeBase {
    Light,
    Dark
}

/** Themes based on other themes it specify the one they're based on, and other properties are optional. */
type themeBasedOn = Partial<theme> & themeName & {
    /** The theme this is based on. It mixes in and properties can be overridden. */
    base: themeBase,

    /** Custom rules, starting with a selector. */
    themeCSS?: string[]
}

type dynamicTheme = {
    name: string,
    get: () => Omit<theme | themeBasedOn, 'name'>
}

/** All available built-in themes. */
export type allThemes = {
    light: theme
    lowContrastLight: theme
    highContrastLight: theme
    blackOnWhite: theme
    dark: theme
    lowContrastDark: theme
    highContrastDark: theme
    whiteOnBlack: theme
    forcedColors: theme
    simpleLight: theme
    simpleDark: theme
    ocean: theme
    dandelion: theme
    candle: themeBasedOn
    midnight: themeBasedOn
    matrix: themeBasedOn
    sunrise: themeBasedOn
    strawberry: themeBasedOn
    magic: dynamicTheme
    unicorn: themeBasedOn
}

/** The settings a user would care about for display. */
export type displayPreferences = {
    /** Arbitrary, app-wide user-defined CSS. Recomputes on apply theme. */
    customCSS?: string

    /** Overrides the filter on the body tag, for fine control over themes. For tech-savvy users. */
    customCSSFilter?: string

    /** Arbitrary app-wide custom JS. Runs in a try-catch. On error, comments out and saves, then reloads. */
    customJS?: string

    /** A desired font family by name such as OpenDyslexic. */
    fontFamily?: string

    /** Column content scaling (default 1.5). */
    zoom?: number

    /** Line height (default 1rem) increases spacing. */
    lineHeight?: string

    /** Contrast from 20-200% (default 100%). Persists without effect if filter is defined. */
    readFilterContrast?: number

    /** Brightness from 30-200% (default 100%). Persists without effect if filter is defined. */
    readFilterBrightness?: number

    /** Saturation from 0-1000% (default 100%). Persists without effect if filter is defined. */
    readFilterSaturate?: number

    /** The hue from 0-360 degrees (default 0). 0=off, anything else does sepia(100%) + hue shift. Persists without
     * effect if filter is defined. */
    readFilterHue?: number

    /** Opacity 0-100% (default 0%). The alpha of the overlay, before the body filter. */
    overlayOpacity?: number

    /** Color of the overlay (default black). This is a 6-digit hex color. Opacity converts to transparency. */
    overlayColor?: string

    /** The mix-blend-mode of the overlay (default normal). This is any of the supported mixings. */
    overlayBlending?: string

    /** Usually about 50rem, which is a good mobile form factor + better for human vision than typical books. It helps
     * reduce cognitive load, but can be set based on reader preferences. */
    columnWidth?: string

    /** Default on. Alt text of text is possible. This turns it off. */
    screenReaderAlting?: boolean

    /** Default off. Disabled controls show 🛇 instead of graying out. */
    showDisabledStatus?: boolean

    /** Whether to run JS and HTML from the story (default on). Reasoning is, it's essential for many stories and as
     * good for trust as any website, especially given the global privacy abuse history of websites. */
    executeCodeAndHtml?: boolean

    /** Changes the background color of text segments on click. Helps with dyslexia. */
    textHoverHighlight?: string

    /** The font size of the first letter in a paragraph, in em units (1 = unchanged). Helps with dyslexia. */
    paragraphStartingFontSize?: number

    /** The color of the first letter in a paragraph. Helps with dyslexia. */
    paragraphStartingColor?: string
}
//#endregion