/** The story is written directly in a superset of Markdown; see the readme. */

import * as marked from 'marked'
import { injectPronouns } from '../core/model/placeholders'
import { getFronters } from '../core/model/system'
import { outputHTML } from './display'
import { character, fork, forkDescriptorName, forkDescriptors, forkLink, game, linkDescriptorName, linkDescriptors, triggerWarning } from '../core/model/model'
import { characters } from '../story/characters'

/** Fork name: string start, @ symbol, any whitespace, 1+ words and any remaining words or whitespace. */
const _untrimmed_fork_name = /(?<=^@)\s*\w+(\w| )*/gum

/** Fork descriptor: string start, 2 @ symbols, any whitespace, 1+ words and any remaining words, whitespace or commas. */
const _untrimmed_fork_descriptor = /(?<=^@@)\s*\w+(\w| |,)*/gum

const _startswith_tag = /^\s*<.+?>/u

let _everInitParsing = false

/** Extends the Marked.js engine to handle fork links, alted text, and code eval. Call once. */
export function initParsing(game: game) {
    if (_everInitParsing) { return }
    _everInitParsing = true

    marked.use({ hooks: {
        processAllTokens: tokens => {
            /** Recurse to eval Code tokens, mutating in-place (preserves parent refs to child), or filtering */
            const resolveCodeToken = (token: marked.Token): boolean => {
                // Recursive iteration. Many tokens have a "tokens" attribute and some like TableCell are hard to test
                // for, so do it generically.
                if (Array.isArray((token as any).tokens)) {
                    const tokens = (token as any).tokens as marked.Token[]
                    (token as any).tokens = tokens.filter(token => resolveCodeToken(token))
                }

                if (token.type === 'code' || token.type === 'codespan') {
                    try {
                        // Valid Javascript can't start with a < character, and HTML must. So we just fork this into an
                        // HTML token to render later. Very convenient! Works in-line but ```html is nice when editing.
                        if (_startswith_tag.test(token.text)) {
                            const tokenAs = token as marked.Tokens.HTML
                            tokenAs.type = "html"
                            tokenAs.text = token.text
                            tokenAs.raw = token.text
                            tokenAs.block = false
                            tokenAs.pre = false
                            return true
                        }

                        // Assume the code is Javascript and try to execute it.
                        // Codespans use eval() for its expression-returning (for brevity) if an = sign isn't present
                        // (not a die-hard metric that it's not just an expression, but almost always accurate). We use
                        // eval *in* Function() because we'd have to create vars with those names otherwise, and
                        // minification would break user expectations on top of that.
                        let result = (token.type === 'codespan' && !(token.text as string).includes('='))
                            ? Function("game", "characters", "c", `return eval(${token.text})`)(game, characters, game.codecontext)
                            : Function("game", "characters", "c", token.text)(game, characters, game.codecontext)
                        
                        if (typeof result === 'boolean' ||
                            typeof result === 'number' ||
                            typeof result === 'string')
                        {
                            const tokenAs = token as marked.Tokens.Text
                            result = `${result}`
                            tokenAs.type = "text"
                            tokenAs.text = result
                            tokenAs.raw = result
                            tokenAs.escaped = false
                            return true
                        }
                    } catch (err) {
                        game.log.push({ type: "warn", text: `In fork "${game.story.fork.name}", user code had an error: ${err}` })
                    }

                    return false // discard code tokens with no valid return value
                }
                
                return true // keep unrelated tokens
            }

            /** Recurse to selectively replace overriden link syntax by replacing parent */
            const resolveLinkToken = (list: marked.Token[], index: number): void => {
                const token = list[index]
                // Recursive iteration. Many tokens have a "tokens" attribute and some like TableCell are hard to test
                // for, so do it generically.
                if (Array.isArray((token as any).tokens)) {
                    const tokens = (token as any).tokens as marked.Token[]
                    for (let i = 0; i < tokens.length; i++) {
                        resolveLinkToken(tokens, i)
                    }
                }

                // Override for alt text replacement and fork links
                if (token.type === 'link') {
                    const urlForkOrAlt = (token.href as string).trim().toLowerCase()

                    // Track the fork link and format into an HTML token, replacing this one
                    if (urlForkOrAlt.startsWith('@')) {
                        const withoutAtSymbol = urlForkOrAlt.substring(1)
                        const link = processLink(game, token.text, withoutAtSymbol)
                        const button = _createForkLink(link)
                        game.story.links.push(link)
                        list[index] = {
                            block: false,
                            pre: false,
                            raw: button.outerHTML,
                            text: button.outerHTML,
                            type: 'html'
                        } satisfies marked.Tokens.HTML
                    }

                    // Treat as alt text of text
                    else if (!urlForkOrAlt.startsWith('http') &&
                        !urlForkOrAlt.startsWith('www') &&
                        !urlForkOrAlt.endsWith('.com'))
                    {
                        const alted = _createAltedText(token.text, (token.href as string).trim())
                        const asHTML = alted.map(span => span.outerHTML).join('')
                        list[index] = {
                            block: false,
                            pre: false,
                            raw: asHTML,
                            text: asHTML,
                            type: 'html'
                        } satisfies marked.Tokens.HTML
                    }
                }
            }

            // Evals all code in the Markdown, consuming the code token entirely and producing a new text token in
            // its place, if it returns a bool/number/string. Fills the newTokens array.

            // Evals code tokens, possibly mutating to a Text token, else omitting. Other tokens pass through.
            tokens = tokens.filter(token => resolveCodeToken(token))

            // Mutates fork links and alt text to an HTML token. All else passes through.
            for (let i = 0; i < tokens.length; i++) {
                resolveLinkToken(tokens, i)
            }

            return tokens
        }
    } })
}

//#region First-time parsing of story.md
/** 
 * Finds all fork headers with syntax "\@fork name" which are at the start of a line, and breaks the text into groups
 * based on that. This is parsing step 1. */
export function separateIntoForks(game: game, str: string): fork[] {
    const matches = Array.from(str.matchAll(_untrimmed_fork_name))
    const forks: fork[] = []
    let lastIndex = 0
    let lastForkName = ""

    matches.forEach((match, index) => {
        if (lastIndex !== 0) {
            const content = str.substring(lastIndex + matches[index - 1][0].length, match.index - 1).trim()
            if (content !== '') {
                forks.push(processFork(game, lastForkName, content))
            } else {
                game.log.push({ type: "warn", text: `The fork "${lastForkName}" has no contents` })
            }
        }

        const forkName = match[0].trim().toLowerCase()
        lastIndex = match.index

        if (index === matches.length - 1) {
            const content = str.substring(lastIndex + match[0].length).trim()
            if (content !== '') {
                forks.push(processFork(game, forkName, content))
            } else {
                game.log.push({ type: "warn", text: `The fork "${forkName}" has no contents` })
            }
        }

        lastForkName = match[0].trim().toLowerCase()
    })

    // There is always one remaining fork.

    if (forks.length === 0) {
        game.log.push({ type: "err", text: "No forks were found!" })
    }

    return forks
}

/** Returns a fork with descriptors. Content and links to other forks are not parsed except to remove fork names and
 * descriptors. Fork links must wait until code and placeholders are processed, since they depend on dynamic content
 * (code can create fork links) that is known only when the fork is visited in-game. */
function processFork(game: game, name: string, content: string): fork {
    const forkDescriptorMatches = content.matchAll(_untrimmed_fork_descriptor)
    
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
        descriptors: descriptors
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

/** Returns a fork link definition, omitting bad descriptors and logging errors. */
function processLink(game: game, textPart: string, urlPart: string): forkLink {
    const newDescriptors: linkDescriptors[] = []
    const allDescriptors = urlPart.split(',').map(o => o.trim().toLowerCase())
    const forkToLinkTo = allDescriptors.splice(0, 1)[0]

    for (const entry of allDescriptors) {
        const args = entry.split(/\w*/g).map(o => o.trim())
        
        if (args.length > 0) {
            const name = args.splice(0, 1)[0] as linkDescriptorName
            switch (name) {
                case linkDescriptorName.Mental:
                case linkDescriptorName.Physical:
                case linkDescriptorName.Social:
                    if (Number.isSafeInteger(args[1])) {
                        newDescriptors.push({
                            name: name,
                            amount: +args[1]
                        })
                        continue
                    } else {
                        game.log.push({ type: "err", text: `Fork link descriptor "${name}" has invalid amount: "${args[1]}"` })
                    }
                    break
                default: name satisfies never // catch missing TS cases
                    game.log.push({ type: "err", text: `Unknown fork link descriptor: "${name}"` })
                    break
            }
        } else {
            game.log.push({ type: "err", text: `Fork link descriptor "${urlPart}" is invalid.` })
            continue
        }
    
        game.log.push({ type: "err", text: `Fork link descriptor "${urlPart}" is not valid and was skipped.` })
    }

    return {
        name: forkToLinkTo,
        text: textPart,
        descriptors: newDescriptors
    }
}
//#endregion

/** Loads a fork by setting the game's current fork and options, parsing the fork contents, and sending them to display. */
export function jumpToFork(game: game, fork: fork) {
    game.story.fork = fork

    // Inject placeholders
    const frontingList = getFronters(game.player.system)
    fork.contentParsed = injectPronouns(frontingList.headmates[0], fork.contentRaw, frontingList.count === 1)

    // Output to HTML. Executes user code, handles fork options and alted text as side effects.
    const html = marked.parse(fork.contentParsed ?? fork.contentRaw, { gfm: true, breaks: true }) as string
    const container = document.createElement('span')
    container.setHTMLUnsafe(html)

    /** Uses data-fork to attach a click event based on matching a known fork name. It's set lowercase and trimmed,
     * so it's assumed to be so in comparison. */
    const attachForkLinkEvents = (node: ChildNode) => {
        node.childNodes.forEach(node => {
            attachForkLinkEvents(node)
        })

        if (node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === 'BUTTON') {
            const button = node as HTMLButtonElement
            const forkNameIfAny = button.getAttribute('data-fork')
            if (forkNameIfAny) {
                button.addEventListener('click', () => {
                    game.story.forks.some(fork => {
                        if (fork.name.trim() === forkNameIfAny) {
                            jumpToFork(game, fork)
                            return true
                        }

                        return false
                    })
                })
            }
        }
    }

    attachForkLinkEvents(container)
    outputHTML(true, container)
}

/** Formats and returns a button based on the given link. */
function _createForkLink(link: forkLink): HTMLButtonElement {
    const button = document.createElement('button')
    button.classList.add('forkOption')
    button.textContent = link.text

    // Track link name to hook click handler later, since Marked.js renders html from string and this will get lost.
    button.setAttribute('data-fork', link.name)
    return button
}

/** Given text to show and speak, returns two spans configured so the 1st will show text that screen readers skip over,
 * and the second will be read by screen readers but remain invisible. This is used to create alt text for TEXT, to
 * fill a gap in HTML handling of screen reader support. See the "Supporting screen readers" section of WRITING.md. */
function _createAltedText(show: string, speak: string): HTMLSpanElement[] {
    const toShow = document.createElement('span')
    toShow.ariaHidden = 'true'
    toShow.textContent = show
    const toSpeak = document.createElement('span')
    toSpeak.classList.add('sr-only')
    toSpeak.textContent = speak

    return [ toShow, toSpeak ]
}