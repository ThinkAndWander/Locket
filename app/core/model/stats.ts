/** A personality stat system is used so that most actions in game can have cumlative consequences that affect
 * future encounters. Meyers-Briggs, Big Five (OCEAN) and HEXACO systems don’t lend to quantitative needs and
 * generally don’t combine well, so these are based on a Self vs. Not-self ("World") system.
 * 
 * Nothing is really this binary and most of all, it's very compartmentalized in the real world (lingering emotions for
 * just one person, for example) because the mind is a neural net. Everything here is generally good and bad, with
 * nuanced side effects. For example, being self-aware is the basis for severe overthinking and self hate as well as
 * self love and increasing other stats.
 * */
export const enum stat {
    /** Giving input of the Self to World.
     * A spectrum from being shut off to oversharing (potentially making yourself vulnerable). */
    emotionalOpenness = 0,

    /** Taking input from the World. 
     * A spectrum from stubborn to amenable. */
    emotionalListening = 1,

    /** Self awareness.
     * This is not a spectrum, but it affects mental growth and what some traits in combination mean. */
    introspection = 2,

    /** Changing World based on Self and not changing Self based on World.
     * A spectrum from accepting fate to asserting opinion over others. */
    assertiveness = 3,

    /** Changing emotional state based on World.
     * A spectrum from callousness to feeling everything. */
    empathy = 4
}


and the judgment is not guaranteed to be informed nor is the process of updating your thoughts
with outside thoughts. Those processes are part of metacognition, a topic outside this game and
not quantifiable (as are copes to rectify input from the world, or fight-flight-freeze-fawn-feint
conflict responses). The requirements for unrestricted player agency prevents narrowing down
to a specific personality type, anyway.