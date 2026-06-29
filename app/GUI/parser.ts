/** The story is written directly in a superset of Markdown; see the readme. */

import { Marked } from 'marked'
import { createDirectives, Directive } from 'marked-directive'
import { mainStory } from '../story.md'
import { injectPronouns } from '../core/model/pronouns'
import { player } from '../core/model/game'
import { getFronters } from '../core/model/system'
import { outputHTML } from './display'

const forkname_match = /(?<=^@)\s*\w+/gum

/** A top-level token, sorted before anything else in the story text. */
type fork = {
    /** A unique, lowercased and trimmed fork name of \w word characters. */
    name: string,

    /** The contents of the fork, pre-processed only by javascript string interpolation. */
    contents: string,

    /** The contents of the fork, also pre-processed with %placeholder injection. */
    contentsTransformed?: string,

    /** Additional information associated to the fork and delimitted by commas. */
    arguments: string[]
}

/** Finds all fork headers with syntax "\@fork name" which are at the start of a line, and breaks the text into groups
 * based on that. This is parsing step 1. */
function preprocessForks(str: string): fork[] {
    const forkPositions: { name: string, index: number, arguments: string[] }[] = []
    const matches = str.matchAll(forkname_match)

    for (const match of matches) {
        const nameAndArguments = match.input.split(',')
        forkPositions.push({
            name: nameAndArguments[0].trim().toLowerCase(),
            index: match.index,
            arguments: nameAndArguments.slice(1).map(str => str.trim())
        })
    }

    let lastIndex = 0
    const forks: fork[] = []
    for (let i = 0; i < forkPositions.length; i++) {
        if (i === forkPositions.length - 1) {
            forks.push({ name: forkPositions[i].name, arguments: forkPositions[i].arguments,
                contents: str.substring(lastIndex) })
        } else {
            forks.push({ name: forkPositions[i].name, arguments: forkPositions[i].arguments,
                contents: str.substring(lastIndex, forkPositions[i].index) })
        }
    }

    return forks
}

/** When a fork loads, this is performed. */
export function handleFork(player: player, fork: fork): void {

    const marked = new Marked().use({
        walkTokens: (token) => {
            if (token.type === 'link') {
                if (typeof(token.href) === 'string' && token.href.startsWith('@')) {
                    const matches = token.href.matchAll(forkname_match)

                        for (const match of matches) {
                            const nameAndArguments = match.input.split(',')
                            forkPositions.push({
                                name: nameAndArguments[0].trim().toLowerCase(),
                                index: match.index,
                                arguments: nameAndArguments.slice(1).map(str => str.trim())
                            })
                        }
                }
            } // https://github.com/markedjs/marked/blob/f8f411256680bfc870a4faba729409be68fcef4b/src/Tokens.ts#L102
        }
    })

    // First, injects placeholders.
    const frontingList = getFronters(player.system)
    fork.contentsTransformed = injectPronouns(frontingList.headmates[0], frontingList.count === 1, fork.contents)

    // Second, identifies and removes links from the main text.
    // TODO: HANDLE THIS CASE

    // Finally, the given pre-processed fork content and displays the resulting HTML.
    const html = marked.parse(fork.contentsTransformed ?? fork.contents, { gfm: true, breaks: true }) as string
    const container = document.createElement('span')
    container.setHTMLUnsafe(html)
    outputHTML(true, container)
}