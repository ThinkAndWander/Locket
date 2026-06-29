/** Tags used to indicate possible triggering content. If this list is extended, please review the existing storyline
 * and retroactively tag things as appropriate. */
export const enum triggers {
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