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