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

/** Returns up to X sorted entries that match the found one. Order: startswith, contains, letter count */
export function suggest(find: string, upTo: number, from: string[]): string[] {
  const lower = find.trim().toLowerCase()
  const lowerInWords = lower.split(' ')

  // Helps organize results.
  let weightedResults: [number, string][] = from.map(entry => {
    const lowerEntry = entry.toLowerCase()
    if (lowerEntry.startsWith(lower)) { return [0, entry] }
    if (lowerEntry.includes(lower)) { return [1, entry] }

    let wordsFound = 0
    for (let i = 0; i < lowerInWords.length; i++) {
      if (lowerEntry.includes(lowerInWords[i])) { wordsFound++ }
    }

    if (wordsFound === 0) { return [-1, entry] }
    return [2 + lowerInWords.length - wordsFound, entry]
  })

  weightedResults = weightedResults.filter(result => result[0] !== -1)
  weightedResults.sort((a, b) => (a[0] - b[0]) || a[1].localeCompare(b[1]))
  return weightedResults.map(result => result[1]).slice(0, upTo)
}