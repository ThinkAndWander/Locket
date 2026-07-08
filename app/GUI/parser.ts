/** The story is written directly in a superset of Markdown; see the readme. */

import { marked, Marked } from 'marked'
import { mainStory } from '../story.md'
import { injectPronouns } from '../core/model/pronouns'
import { getFronters } from '../core/model/system'
import { outputHTML } from './display'
import { character, fork, forkDescriptorName, forkDescriptors, game, linkDescriptorName, linkDescriptors, triggerWarning } from '../core/model/model'

/** Fork name: string start, @ symbol, any whitespace, 1+ words and any remaining words or whitespace. */
const untrimmed_fork_name = /(?<=^@)\s*\w+(\w|\s)*/gum

/** For descriptor: string start, 2 @ symbols, any whitespace, 1+ words and any remaining words, whitespace or commas. */
const untrimmed_fork_descriptor = /(?<=^@@)\s*\w+(\w|\s|,)*/gum

//#region First-time parsing of story.md
/** 
 * Finds all fork headers with syntax "\@fork name" which are at the start of a line, and breaks the text into groups
 * based on that. This is parsing step 1. */
function separateIntoForks(game: game, str: string): fork[] {
    const matches = str.matchAll(untrimmed_fork_name)
    const forks: fork[] = []
    let lastIndex = 0

    for (const match of matches) {
        const forkName = match[0].trim().toLowerCase()
        if (forkName.length > 0 && !forks.some(forkDef => forkDef.name === forkName)) {
            if (lastIndex !== 0) {
                const content = str.substring(lastIndex, match.index).trim()
                if (content !== '') {
                    const fork = processFork(game, forkName, content)
                    forks.push(fork)

                    if (fork.links.length === 0) {
                        game.log.push({ type: "warn", text: `The fork "${fork.name}" has no links` })
                    }
                } else {
                    game.log.push({ type: "warn", text: `The fork "${forkName}" has no contents` })
                }
            }

            lastIndex = match.index
        } else if (forkName.length === 0) {
            game.log.push({ type: "err", text: `A fork name with no name was found; check for lines starting with @ and no word characters`})
        } else {
            game.log.push({ type: "err", text: `Fork name "${forkName}" appears more than once.` })
        }
    }

    return forks
}

/** Returns a valid fork, including descriptors and links. The content is not parsed except to remove fork names and
 * descriptors. Fork links must wait until code and placeholders are processed, since they depend on dynamic content
 * (code can create fork links) that is known only when the fork is visited in-game. */
function processFork(game: game, name: string, content: string): fork {
    const forkDescriptorMatches = content.matchAll(untrimmed_fork_descriptor)
    
    // Processes all fork descriptors anywhere in the fork.
    const descriptors: forkDescriptors[] = []
    const matches: string[] = []
    for (const match of forkDescriptorMatches) {
        const parsed = processForkDescriptor(game, match[0])
        if (parsed) {
            descriptors.push(parsed)
        }
        matches.push(match[0])
    }

    // Remove all matches from the content.
    matches.forEach(entry => { content = content.replace(entry, "") })

    return {
        name: name,
        contentRaw: content,
        descriptors: descriptors,
        links: [] // TODO: define this too
    }
}

/** Returns a fully valid fork descriptor, or undefined with errors logged. */
function processForkDescriptor(game: game, str: string): forkDescriptors | undefined {
    const args = str.split(',').map(o => o.trim().toLowerCase())
    const name = args.splice(0, 1)[0] as forkDescriptorName

    switch (name) {
        case forkDescriptorName.Trigger:
            const triggers: triggerWarning[] = []
            args.forEach(o => {
                const oTyped = o as triggerWarning
                switch (oTyped) {
                    case triggerWarning.Arachnophobia:
                        triggers.push(triggerWarning.Arachnophobia)
                        break
                    case triggerWarning.BodyShaming:
                        triggers.push(triggerWarning.BodyShaming)
                        break
                    case triggerWarning.Claustrophobia:
                        triggers.push(triggerWarning.Claustrophobia)
                        break
                    case triggerWarning.Dysphoria:
                        triggers.push(triggerWarning.Dysphoria)
                        break
                    case triggerWarning.HomelessHardship:
                        triggers.push(triggerWarning.HomelessHardship)
                        break
                    case triggerWarning.LifestyleAssumption:
                        triggers.push(triggerWarning.LifestyleAssumption)
                        break
                    case triggerWarning.Violence:
                        triggers.push(triggerWarning.Violence)
                        break
                    default: oTyped satisfies never
                        game.log.push({ type: "err", text: `Fork descriptor "trigger" has unknown trigger: "${oTyped}"` })
                }
                return { name: forkDescriptorName.Trigger, triggers: triggers }
            })
            break
        case forkDescriptorName.Time:
            if (Number.isSafeInteger(args[0])) {
                const amount = +args[0]
                if (amount >= 0) {
                    const unit = args[1] as 'minutes'|'hours'
                    if (unit === 'minutes' || unit === 'hours') {
                        return { name: forkDescriptorName.Time, amount: amount, unit: unit }
                    }
                    game.log.push({ type: "err", text: `Fork descriptor "time" has unknown unit: "${unit}"` })                       
                } else {
                    game.log.push({ type: "err", text: `Fork descriptor "time" can't have negative duration: ${amount}` })
                }
            } else {
                game.log.push({ type: "err", text: `Fork descriptor "time" has invalid duration: "${args[0]}"` })
            }
            break
        case forkDescriptorName.People:
            const systemName = args[0]
            if (args.length === 1 || args.length === 2) {
                let foundBySystem: character | undefined
                for (const character of characters) {
                    if (systemName === character.self.systemName?.toLowerCase()) {
                        foundBySystem = character
                        break
                    }
                }

                if (foundBySystem) {
                    if (args.length === 2) {
                        const headmateName = args[1]
                        for (const headmate of foundBySystem.self.headmates) {
                            if (headmateName === headmate.name?.toLowerCase()) {
                                return { name: forkDescriptorName.People, character: foundBySystem, headmate: headmate}
                            }
                        }
                        game.log.push({ type: "err", text: `Fork descriptor "people" for system "${foundBySystem.self.systemName}" has unknown headmate name: "${headmateName}"`})
                    } else {
                        return { name: forkDescriptorName.People, character: foundBySystem }
                    }
                } else {
                    game.log.push({ type: "err", text: `Fork descriptor "people" has unknown person name: "${systemName}"` })
                }
            } else {
                game.log.push({ type: "err", text: `Fork descriptor "people" has wrong argument count: ${args.length}` })
            }
            break
        default: name satisfies never // catch missing TS cases
            game.log.push({ type: "err", text: `Unknown fork descriptor: "${name}"` })
            break
    }

    game.log.push({ type: "err", text: `Fork descriptor "${str}" is not valid and was skipped.` })
    return undefined
}

function loadForkInGame(game: game, fork: fork) {
    game.story.fork = fork

    // Inject all placeholders
    const frontingList = getFronters(game.player.system)
    fork.contentParsed = injectPronouns(frontingList.headmates[0], frontingList.count === 1, fork.contentRaw);

    //game.story.fork.contentRaw
    
    fork.contentParsed = injectPronouns(frontingList.headmates[0], frontingList.count === 1, fork.contentRaw)

    marked.parse(fork.contentRaw)

    const codeOnly = (token: Token) => {
        if (token.type === 'code') {

        }
        if (token.type === 'link') {

            // Parse these as fork links.
            if (token.href.trim().startsWith("@")) {
                game.story.

                // Zero out the token so it won't render.
                token.raw = "[]()"
                token.text = ""
                token.title = ""
                token.href = ""
            }
        }
    };
  
    marked.use({ walkTokens });
}

/** Returns a fully valid fork link descriptor, or undefined with errors logged. */
function processLinkDescriptor(game: game, str: string): linkDescriptors | undefined {
    const args = str.split(',').map(o => o.trim().toLowerCase())

    if (args.length > 0) {
        const name = args.splice(0, 1)[0] as linkDescriptorName
        switch (name) {
            case linkDescriptorName.Mental:
            case linkDescriptorName.Physical:
            case linkDescriptorName.Social:
                if (Number.isSafeInteger(args[1])) {
                    return {
                        name: name,
                        amount: +args[1]
                    }
                } else {
                    game.log.push({ type: "err", text: `Fork link descriptor "${name}" has invalid amount: "${args[1]}"` })
                }
                break
            default: name satisfies never // catch missing TS cases
                game.log.push({ type: "err", text: `Unknown fork link descriptor: "${name}"` })
                break
        }
    } else {
        game.log.push({ type: "err", text: `Fork link descriptor "${str}" is invalid.` })
        return undefined
    }

    game.log.push({ type: "err", text: `Fork link descriptor "${str}" is not valid and was skipped.` })
    return undefined
}
//#endregion

/** When a fork loads, this is performed. */
export function handleFork(game: game, fork: fork): void {
    const marked = new Marked().use({
        walkTokens: (token) => {
            // Finds fork options
            if (token.type === 'link') {
                if (typeof(token.href) === 'string' && token.href.startsWith('@')) {
                    const matches = token.href.matchAll(untrimmed_fork_name)

                        for (const match of matches) {
                            const nameAndArguments = match.input.split(',')
                            game.story.fork.links.push({
                                name: nameAndArguments[0].trim().toLowerCase(),
                                text: token.text,
                                costMental: 0,
                                costPhysical: 0,
                                costSocial: 0
                            })
                        }
                }
            }
        }
    })

    // First, injects placeholders.
    const frontingList = getFronters(game.player.system)
    fork.contentParsed = injectPronouns(frontingList.headmates[0], frontingList.count === 1, fork.contentRaw)

    // Second, identifies and removes links from the main text.
    // TODO: HANDLE THIS CASE

    // Finally, the given pre-processed fork content and displays the resulting HTML.
    const html = marked.parse(fork.contentParsed ?? fork.contentRaw, { gfm: true, breaks: true }) as string
    const container = document.createElement('span')
    container.setHTMLUnsafe(html)
    outputHTML(true, container)
}

export function runForkEngine(game: game): void {

    const allForks: fork[] = separateIntoForks(mainStory)
    handleFork(game, allForks[0])

    // Override function
    const walkTokens = (token: Token) => {
        if (token.type === 'link') {

            // Parse these as fork links.
            if (token.href.trim().startsWith("@")) {
                // Zero out the token so it won't render.
                token.raw = "[]()"
                token.text = ""
                token.title = ""
                token.href = ""
            }
        }
    };
  
  marked.use({ walkTokens });
}

























































import type { MarkedExtension, Hooks, Token } from 'marked'
import { characters } from '../story/characters'

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