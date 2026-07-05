/** The story is written directly in a superset of Markdown; see the readme. */

import { Marked } from 'marked'
import { mainStory } from '../story.md'
import { injectPronouns } from '../core/model/pronouns'
import { getFronters } from '../core/model/system'
import { outputHTML } from './display'
import { fork, game } from '../core/model/model'

const forkname_match = /(?<=^@)\s*\w+/gum

/** Finds all fork headers with syntax "\@fork name" which are at the start of a line, and breaks the text into groups
 * based on that. This is parsing step 1. */
function _preprocessForks(str: string): fork[] {
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
                contents: str.substring(lastIndex), links: [] })
        } else {
            forks.push({ name: forkPositions[i].name, arguments: forkPositions[i].arguments,
                contents: str.substring(lastIndex, forkPositions[i].index), links: [] })
        }
    }

    return forks
}

/** When a fork loads, this is performed. */
export function handleFork(game: game, fork: fork): void {
    const marked = new Marked().use({
        walkTokens: (token) => {
            if (token.type === 'link') {
                if (typeof(token.href) === 'string' && token.href.startsWith('@')) {
                    const matches = token.href.matchAll(forkname_match)

                        for (const match of matches) {
                            const nameAndArguments = match.input.split(',')
                            game.story.fork.links.push({
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
    const frontingList = getFronters(game.player.system)
    fork.contentsTransformed = injectPronouns(frontingList.headmates[0], frontingList.count === 1, fork.contents)

    // Second, identifies and removes links from the main text.
    // TODO: HANDLE THIS CASE

    // Finally, the given pre-processed fork content and displays the resulting HTML.
    const html = marked.parse(fork.contentsTransformed ?? fork.contents, { gfm: true, breaks: true }) as string
    const container = document.createElement('span')
    container.setHTMLUnsafe(html)
    outputHTML(true, container)
}

export function runForkEngine(game: game): void {

    const allForks: fork[] = _preprocessForks(mainStory)
    handleFork(game, allForks[0])
}

























































import type { MarkedExtension, Hooks } from 'marked'

/**
 * A [marked](https://marked.js.org/) extension that overrides ```js blocks to run them as the body of a new function,
 * providing context to access the game, characters, and utility functions.
 */
function jsBlockExecution(): MarkedExtension {
  return {
    name: 'code',
    level: 'block',
    tokenizer: (_, parent) => {
        parent.forEach(token => {
            if (token.type !== 'code' || token.lang !== 'js' || !token.text) {
                return
            }

            // do stuff here
        })

        return false
    }
  }
}