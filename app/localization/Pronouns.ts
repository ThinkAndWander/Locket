import { headmate, player } from '../Model/Player'

/**
 * Known and included pronoun sets. Cases are: nominative, accusative, pronomial possessive, predicative possessive, reflexive.
 * Reference: https://lgbtqia.wiki/wiki/Neopronouns
*/
export const pronouns = {
  // Basic pronouns
  they: ['they', 'them', 'their', 'theirs', 'themself'],
  she: ['she', 'her', 'her', 'hers', 'herself'],
  he: ['he', 'him', 'his', 'his', 'himself'],
  it: ['it', 'it', 'its', 'its', 'itself'], // nonhuman identities, or to avoid people who use "they" to misgender by omission

  // Pronouns based on pronoun shorthands
  e_old: ['E', 'Em', 'Es', 'Ems', 'Emself'], // based on he. Year 1890
  e: ['E', 'Em', 'Eir', 'Eirs', 'Emself'], // based on they. Year 1975
  ey: ['Ey', 'Em', 'Eir', 'Eirs', 'Emself'], // based on they. Year 1975

  // Pronouns based on specific words and phrases
  ae: ['ae', 'aer', 'aer', 'aers', 'aerself'], // based on "air", sounds like her. Year 1920
  thon: ['thon', 'thon', 'thons', 'thons', 'thonself'], // contracted from "that one". Year 1958
  co: ['co', 'co', 'cos', 'cos', 'coself'], // based on Indo-European word "ko". Year 1970
  per: ['per', 'per', 'per', 'pers', 'perself'], // based on "person", sounds like she. Year 1972
  hu: ['hu', 'hum', 'hus', 'hus', 'huself'], // based on "human". Year 1982
  one: ['one', 'one', "one's", "one's", 'oneself'],

  // Pronouns based on phonetics
  ve: ['ve', 'ver', 'vis', 'vers', 'verself'], // based on he/she alternatingly. Year ~1970s
  vi: ['vi', 'vir', 'vis', 'virs', 'virself'], // based on he/she alternatingly. Year ~1970s
  xe: ['xe', 'xem', 'xyr', 'xyrs', 'xemself'], // based on he/she alternatingly. Year 1973. Many unstandardized alts; this is a whole set
  ze: ['ze', 'zir', 'zir', 'zirs', 'zirself'], // based on xe. Year 1997
  fae: ['fae', 'faer', 'faer', 'faers', 'faerself'], // based on she, themed after the Fae with a nonbinary undertone. Year 2013    
} satisfies { [key: string]: [string, string, string, string, string] }

export type pronounSet = keyof typeof pronouns

/**
 * Localized strings may use placeholders of the 5 conjugations of them: them, their, theirs, themself. The correct
 * pronoun set and conjugations, if any, and alternation logic is applied by this function.
 */
export function pronounify(headmate: headmate, localizedWithPronounPlaceholders: string): string {
  // TODO: if pronouns in another language are not available, default to the player's name always.

  let set: pronounSet | [string, string, string, string, string] | undefined // uses name if undefined
  const isArray = Array.isArray(set)

  switch (headmate.pronounBehavior) {
    case 'use name': break
    case 'use pronouns':
      set = headmate.pronouns.length > 0 ? headmate.pronouns[0] : undefined
      break
    case 'alternate she/he':
      set = (headmate.pronounAlted > 0) ? 'he' : 'she'
      headmate.pronounAlted = (headmate.pronounAlted > 0) ? 0 : 1
      break
    case 'alternate each':
      set = headmate.pronouns.length > 0 ? headmate.pronouns[headmate.pronounAlted] : undefined
      headmate.pronounAlted = (headmate.pronounAlted >= headmate.pronouns.length - 1) ? 0 : headmate.pronounAlted + 1
      break
  } satisfies 

  return localizedWithPronounPlaceholders
    .replaceAll('%they%', set === undefined ? headmate.name : Array.isArray(set) ? set[0] : pronouns[set][0])
    .replaceAll('%them%', set === undefined ? headmate.name : Array.isArray(set) ? set[1] : pronouns[set][1])
    .replaceAll('%their%', set === undefined ? headmate.name : Array.isArray(set) ? set[2] : pronouns[set][2])
    .replaceAll('%theirs%', set === undefined ? headmate.name : Array.isArray(set) ? set[3] : pronouns[set][3])
    .replaceAll('%themself%', set === undefined ? headmate.name : Array.isArray(set) ? set[4] : pronouns[set][4])
}