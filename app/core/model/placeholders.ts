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
export function injectPronouns(headmate: headmate, str: string, soloFronting?: boolean): string {

  // 3P = third person (from outside self), 1P = first person (self)
  // These describe 1P and 3P pronouns and plurality which can be single (I/She) or plural (We/They)
  let prns3P: pronounSet | [string, string, string, string, string] = "appendForNames"
  let plurality1P: selfPronounSet = "appendForNames"
  let plurality1P_subjectMatch: keyof typeof subjectMatch = 'otherSingle'
  let plurality3P: keyof typeof subjectMatch = 'otherSingle'

  // When the subject prefers to use "We" in first person, and name is used, the system name is used
  // This is also done for co-fronting subjects. Otherwise it's individual name, then system name.
  // Notably both 1P and 3P follow that preference. 
  const name = !soloFronting || headmate.pronouns1P === 'always plural'
    ? headmate.system.systemName ?? headmate.name ?? 'Player'
    : headmate.name ?? headmate.system.systemName ?? 'Player'

  // Note: a headmate with no pronouns will be identified only by name both in 1P and 3P.
  // There are a few ways to pick the 3P pronouns to use and this does that.
  if (headmate.pronouns3P.length > 0) {
    switch (headmate.pronounBehavior) {
      case 'use name': break // already the default
      case 'use pronouns': // Uses the 3P pronouns of this headmate.
        prns3P = headmate.pronouns3P[0]
        break
      case 'cycle': // Picks the next entry in the pronoun set, wrapping to the start
        headmate.pronounAlted = (headmate.pronounAlted + 1) % headmate.pronouns3P.length
        prns3P = headmate.pronouns3P[headmate.pronounAlted]
        break
      case 'randomize': // randomly picks an entry in the pronoun set. Doesn't avoid picking the same as last time
        prns3P = headmate.pronouns3P[Math.round(Math.random() * (headmate.pronouns3P.length - 1))]
        break
      default: headmate.pronounBehavior satisfies never // Catch missing TS cases
    }
  }
  
  // Determine whether it's "I" or "We" in 1P, and "She" or "They" in 3P
  switch (headmate.pronouns1P) {
    case 'use name': break // already the default
    case 'singular': // I
      plurality1P = 'singular'
      plurality1P_subjectMatch = 'selfSingle'
      break
    case 'plural': // I/She, We/They. Depends on if co-fronting
      plurality1P = soloFronting ? 'singular' : 'plural'
      plurality1P_subjectMatch = soloFronting ? 'selfSingle' : 'selfPlural'
      plurality3P = soloFronting ? 'otherSingle' : 'otherPlural'
      break
    case 'always plural': // We/They. Doesn't depend on co-fronting
      plurality1P = 'plural'
      plurality1P_subjectMatch = 'selfPlural'
      plurality3P = 'otherPlural'
      break
    default: headmate.pronouns1P satisfies never // Catch missing TS cases
  }
  
  // Use headmate/system name in 3P, or pronoun set (chosen or written)
  const pronoun3P = (index: number) => prns3P === 'appendForNames'
      ? name
      : Array.isArray(prns3P)
        ? prns3P[index] // player wrote in their 3P pronouns
        : pronouns[prns3P][index] // pre-known 3P pronouns
  
  // Uses the 1P pronoun. Names append it too, which for them can be empty or 's like "Eve's" because names are subject
  // to a possessive casing rule
  const pronoun1P = (index: number) => (plurality1P === 'appendForNames' ? name : '')
    + selfPronouns[plurality1P][index]

  return str
    // Pronoun-matching words. Replacement order is important
    .replaceAll("%(name, name)", listNames([headmate], listNameFormat.Comma))
    .replaceAll("%(name, and name)", listNames([headmate], listNameFormat.CommaAnd))
    .replaceAll("%(name, or name)", listNames([headmate], listNameFormat.CommaOr))
    .replaceAll("%(name or name)", listNames([headmate], listNameFormat.Or))
    .replaceAll("%(name and name)", listNames([headmate], listNameFormat.And))
    .replaceAll("%am", subjectMatch[plurality1P_subjectMatch][0])
    .replaceAll("%was", subjectMatch[plurality1P_subjectMatch][1])
    .replaceAll("%have", pronoun1P(2) + ` ${subjectMatch[plurality1P_subjectMatch][2]}`)
    .replaceAll("%I'm", pronoun1P(4) + ` ${subjectMatch[plurality1P_subjectMatch][4]}`)
    .replaceAll("%I've", pronoun1P(5) + ` ${subjectMatch[plurality1P_subjectMatch][5]}`)
    .replaceAll("%are", prns3P !== 'appendForNames' ? ` ${subjectMatch[plurality3P][0]}` : '')
    .replaceAll("%were", prns3P !== 'appendForNames' ? ` ${subjectMatch[plurality3P][1]}` : '')
    .replaceAll("%have", prns3P !== 'appendForNames' ? ` ${subjectMatch[plurality3P][2]}` : '')
    .replaceAll("%'d", prns3P !== 'appendForNames' ? ` ${subjectMatch[plurality3P][3]}` : '')
    .replaceAll("%'re", prns3P !== 'appendForNames' ? ` ${subjectMatch[plurality3P][4]}` : '')
    .replaceAll("%'ve", prns3P !== 'appendForNames' ? ` ${subjectMatch[plurality3P][5]}` : '')
    // %s means pluralize and is used like "she want%s" to conditionally add the s
    .replaceAll(/\w*?(?=%s)/g, (str) => str + subjectMatch[plurality3P][6])

    // Pronouns
    .replaceAll('%I', pronoun1P(0))
    .replaceAll('%me', pronoun1P(1))
    .replaceAll('%my', pronoun1P(2))
    .replaceAll('%myself', pronoun1P(3))
    .replaceAll('%mine', pronoun1P(4))
    .replaceAll('%they', pronoun3P(0))
    .replaceAll('%them', pronoun3P(1))
    .replaceAll('%their', pronoun3P(2))
    .replaceAll('%theirs', pronoun3P(3))
    .replaceAll('%themself', pronoun3P(4))
}

/** The format for combining names in a list. */
export const enum listNameFormat {
  /** e.g. Eve, Brent, Wind */
  Comma,

  /** e.g. Eve, Brent and Wind */
  CommaAnd,

  /** e.g. Eve, Brent or Wind */
  CommaOr,

  /** e.g. Eve and Brent and Wind */
  And,

  /** e.g. Eve or Brent or Wind */
  Or
}

/** Lists headmates by name, using the system name only if > 3 are co-fronting and there is a system name. */
export function listNames(headmates: headmate[], format: listNameFormat): string {
  if (headmates.length === 1) { return getName(headmates[0]) }
  if (headmates.length > 3 && headmates[0].system.systemName) { return headmates[0].system.systemName }

  switch (format) {
    case listNameFormat.And:
      return headmates.filter(mate => mate.name).map(mate => getName(mate)).join(' and ')
    case listNameFormat.Comma:
      return headmates.filter(mate => mate.name).map(mate => getName(mate)).join(', ')
    case listNameFormat.CommaAnd:
      if (headmates.length === 2) { return headmates.filter(mate => mate.name).map(mate => getName(mate) ?? '').join(' and ') }
      return headmates.filter(mate => mate.name).map((mate, i) => i < headmates.length - 1 ? `${getName(mate)}, ` : ` and ${getName(mate)}`).join()
    case listNameFormat.CommaOr:
      if (headmates.length === 2) { return headmates.filter(mate => mate.name).map(mate => getName(mate) ?? '').join(' or ') }
      return headmates.filter(mate => mate.name).map((mate, i) => i < headmates.length - 1 ? `${getName(mate)}, ` : ` or ${getName(mate)}`).join()
    case listNameFormat.Or:
      return headmates.filter(mate => mate.name).map(mate => getName(mate)).join(' or ')
    default: format satisfies never // Catch missing TS cases
  }

  return ''
}

/** Returns the name of a headmate, respecting "always plural" first pronouns by using the system name, if defined. */
export function getName(headmate: headmate): string {
  return (headmate.pronouns1P === 'always plural')
    ? headmate.system.systemName ?? headmate.name ?? ''
    : headmate.name ?? headmate.system.systemName ?? ''
}