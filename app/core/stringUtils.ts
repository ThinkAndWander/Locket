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