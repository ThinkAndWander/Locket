/** This correctly gets the 1st letter of very many sentence structures, some informal too, with few/no false
 * positives. Tested with AO3 stories. Examples it works on, with matches shown by a leading underscore:
 * 
 * _This is a test, showing "matches". "_It works on dialog,"
 * 
 * "_And across lines."
 * but,
 * 
 * _Only for capitalized letters
 * _An ending punctuation is usually needed
 * 
 * ..._Such as this...not this.
 * ... ... _It matches this, though!
 * And mixed punctuations!?!? _Yep. ^_^
 * “ _It can be a little funky ”
 * 
 * _It will work
 * _Across lines separated by newline
 * as well
 * 
 * Consider en and em dashes.
 * (And parentheses.)
 * */
const sentence1stLetterRegex = /(?<=([.?!…]|^["'“”‘’]?)\s*["'“”‘’]?\s*)[A-Z]/gum

/** Capitalizes after sentences for basic grammar (. ? !), to correct placeholders. */
export function capitalize(str: string) {
  let endOfSentence = false
  let newString = ""
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "." || str[i] === "?" || str[i] === "!") {
      endOfSentence = true
    }
    if ((i === 0 || endOfSentence) && /[a-z]/gu.test(str[i])) {
      newString += str[i].toUpperCase()
      endOfSentence = false
    } else {
      newString += str[i]
    }
  }
  
  return newString
}

export function markSentencesInHTML(root: ChildNode) {
  root.childNodes.forEach(node => markSentencesInHTML(node))

  if (root.nodeType === root.TEXT_NODE) {

  }

/**
 * /(?<=([.?!…]|^["'“”‘’]?)\s*["'“”‘’]?\s*)[A-Z]/gum

Solution:
1. Iterate all regular elements and read their rendered final text.
2. For each element, perform regex. Accumulate the text for each match and do this (prior to adding it to the DOM so it's not reupdating a lot):

  2a. Set the original tag's text to be empty.
  2b. Create an array of span elements with class "sentence" containing each match.
  2c. In the styles.css, use span.sentence::first-letter to style these.
 */
}