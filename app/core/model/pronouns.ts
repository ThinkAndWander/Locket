import { headmate } from './model'
import { getFronters } from './system'

/** These words change in proportion to an associated plurality, in this case plurality of the pronoun.
 * 
 * Sample sentences for each index:  
 * she is   | she was   | she has   | she'd  | she's   | she has | she wants  
 * they are | they were | they have | they'd | they're | they've | they want  
 * I am     | I was     | I have    | I'd    | I'm     | I've    | I want  
 * We are   | We were   | We have   | We'd   | We're   | We've   | We want  
 * - Index 3-5 are contraction endings added after the pronoun  
 * - Index 6 for "other" is pluralization of verbs that follow pronoun  
 * - Index 6-7 for "self" are possessive words
 * 
 * Names use "other single" format and are pluralized in possessive contexts */
export const subjectMatch = {
  otherSingle: ['is', 'was', 'has', "'d", "'s", " has", 's'], // Names use this tense but don't contract 's like "Jane is" -> "Jane's" because it's misleading
  otherPlural: ['are', 'were', 'have', "'d", "'re", "'ve", ''],
  selfSingle: ['am', 'was', 'have', "'d", "'m", "'ve", ''],
  selfPlural: ['are', 'were', 'have', "'d", "'re", "'ve", ''],
}

/** Common known pronouns and pronoun-agreeing words others may use to refer to a headmate.
 * Reference: https://lgbtqia.wiki/wiki/Neopronouns
 * 
 * TODO: A lot of these will probably not get pronounced correctly by screen reader. */
export const pronouns = {
  // Possessive cases modify names, e.g. Jane -> Jane's.
  appendForNames: ['', '', "'s", '', ''],

  // Very common pronouns
  they: ['they', 'them', 'their', 'theirs', 'themself'],
  she: ['she', 'her', 'her', 'hers', 'herself'],
  he: ['he', 'him', 'his', 'his', 'himself'], // Names use this row, but case 3 modifies names like Jane -> Jane's
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

/** Common known pronouns and pronoun-agreeing words a headmate may use to refer to theirself. */
export const selfPronouns = {
  appendForNames: ['', '', "'s", '', "'s"], // e.g. Jane -> Jane's, for possessive words.
  singular: ['I', 'me', 'my', 'myself', 'mine'],
  plural: ['we', 'us', 'our', 'ourselves', 'ours']
}

export type pronounSet = keyof typeof pronouns
export type selfPronounSet = keyof typeof selfPronouns

/** This function takes a string and makes substitutions for words, including contextually sensitive
 * words that are not pronouns, based on the given headmate's pronoun preferences. It returns the new string. */
export function injectPronouns(headmate: headmate, soloFronting: boolean, str: string): string {
  const fronters = getFronters(headmate.system)

  let extSet: pronounSet | [string, string, string, string, string] = "appendForNames"
  let selfSet: selfPronounSet = "appendForNames"
  let selfPlurality: keyof typeof subjectMatch = 'otherSingle'
  let extPlurality: keyof typeof subjectMatch = 'otherSingle'
  const name = !soloFronting || headmate.selfPronounBehavior === 'always plural'
    ? headmate.system.systemName ?? headmate.name ?? 'Player'
    : headmate.name ?? headmate.system.systemName ?? 'Player'

  // The typical set of pronouns people use is "external", i.e. used to describe them.
  if (headmate.pronouns.length > 0) {
    switch (headmate.pronounBehavior) {
      case 'use name': break
      case 'use pronouns':
        extSet = headmate.pronouns[0]
        break
      case 'cycle':
        headmate.pronounAlted = (headmate.pronounAlted + 1) % headmate.pronouns.length
        extSet = headmate.pronouns[headmate.pronounAlted]
        break
      case 'randomize':
        extSet = headmate.pronouns[Math.round(Math.random() * (headmate.pronouns.length - 1))]
        break
      default: headmate.pronounBehavior satisfies never // Catch missing TS cases
    }
  }
  
  switch (headmate.selfPronounBehavior) {
    case 'use name': break
    case 'singular':
      selfSet = 'singular'
      selfPlurality = 'selfSingle'
      break
    case 'plural':
      selfSet = soloFronting ? 'singular' : 'plural'
      selfPlurality = soloFronting ? 'selfSingle' : 'selfPlural'
      extPlurality = soloFronting ? 'otherSingle' : 'otherPlural'
      break
    case 'always plural':
      selfSet = 'plural'
      selfPlurality = 'selfPlural'
      extPlurality = 'otherPlural'
      break
    default: headmate.selfPronounBehavior satisfies never // Catch missing TS cases
  }
  
  const pronounFor = (index: number) => (extSet === 'appendForNames' ? name : Array.isArray(extSet) ? extSet[index] : pronouns[extSet][index])
  const selfPronounFor = (index: number) => ((selfSet === 'appendForNames' ? name : '') + selfPronouns[selfSet][index])

  return str
    // Pronoun-matching words
    .replaceAll(/%am/g, subjectMatch[selfPlurality][0])
    .replaceAll(/%was/g, subjectMatch[selfPlurality][1])
    .replaceAll(/%have/g, selfPronounFor(2) + ` ${subjectMatch[selfPlurality][2]}`)
    .replaceAll(/%I'm/g, selfPronounFor(4) + ` ${subjectMatch[selfPlurality][4]}`)
    .replaceAll(/%I've/g, selfPronounFor(5) + ` ${subjectMatch[selfPlurality][5]}`)
    .replaceAll(/%are/g, extSet !== 'appendForNames' ? ` ${subjectMatch[extPlurality][0]}` : '')
    .replaceAll(/%were/g, extSet !== 'appendForNames' ? ` ${subjectMatch[extPlurality][1]}` : '')
    .replaceAll(/%have/g, extSet !== 'appendForNames' ? ` ${subjectMatch[extPlurality][2]}` : '')
    .replaceAll(/%'d/g, extSet !== 'appendForNames' ? ` ${subjectMatch[extPlurality][3]}` : '')
    .replaceAll(/%'re/g, extSet !== 'appendForNames' ? ` ${subjectMatch[extPlurality][4]}` : '')
    .replaceAll(/%'ve/g, extSet !== 'appendForNames' ? ` ${subjectMatch[extPlurality][5]}` : '')
    // %s means pluralize and is used like "she want%s" to conditionally add the s
    .replaceAll(/\w*?(?=%s)/g, (str) => str + subjectMatch[extPlurality][6])

    // Pronouns
    .replaceAll('%I', selfPronounFor(0))
    .replaceAll('%me', selfPronounFor(1))
    .replaceAll('%my', selfPronounFor(2))
    .replaceAll('%myself', selfPronounFor(3))
    .replaceAll('%mine', selfPronounFor(4))
    .replaceAll('%they', pronounFor(0))
    .replaceAll('%them', pronounFor(1))
    .replaceAll('%their', pronounFor(2))
    .replaceAll('%theirs', pronounFor(3))
    .replaceAll('%themself', pronounFor(4))
}