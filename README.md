# Locket

A cozy slice-of-life text adventure where you live and discover your own adventures and friends along the way 💛

Programmers, instructions are below.
Writers, [see the WRITING.md file](https://github.com/ThinkAndWander/Locket/blob/main/guide/WRITING.md).

## Compiling

See License.md for source code usage rights.
This project uses npm, typescript and eslint.

**First time set up**  
1. Download this project
2. Download [node & npm](https://www.npmjs.com/get-npm)
3. If you use VSCode, go to Extensions and search ESLint to install it for live linting help

**Build**  
This project outputs a static website minified at index.html with a sourcemapped version at index_debug.html.
1. Run `npm run install` once after download
2. After editing, run `npm run build` in a Git Bash terminal. VSCode has one built in.
3. Open website/index_debug.html to see it

First time set up and build looks like:
```
git clone https://github.com/ThinkAndWander/Locket.git
cd Locket
npm install
npm run build
```

## Architecture notes

Locket is a simple program. It uses a Markdown parser, which is extended to handle:
- `@ Fork names` [(guide)](https://github.com/ThinkAndWander/Locket/blob/main/guide/WRITING.md#get-started)
- `@@ Fork descriptors` [(info)](https://github.com/ThinkAndWander/Locket/blob/main/guide/WRITING.md#all-fork-descriptors)
- `[fork links](@to_fork, descriptor1, ...)` [(info)](https://github.com/ThinkAndWander/Locket/blob/main/guide/WRITING.md#all-link-descriptors)
- `[sighted text](screen reader text)` [(info)](https://github.com/ThinkAndWander/Locket/blob/main/guide/WRITING.md#supporting-screen-readers)
- `%placeholders` for pronouns [(info)](https://github.com/ThinkAndWander/Locket/blob/main/guide/WRITING.md#placeholders)
- `` `native javascript` `` that runs on fork load

Then the game loads a saved file or spins up a new one, parses story.md into an array of forks and their metadata, and
begins a day-energy based cycle of encounters for the player. That's it in a nutshell!

**How characters work**  
Basically the entire game revolves around characters. They're defined in story/characters.ts as a system of 1+
headmates. Most are singlets.

Headmates possess:
- Variables, like stats, attributes and skills
- Current emotions and energy for things
- Memories for long-term associations
- Reactions to create evolving personalities

All headmates may define how they interact in a system, although it doesn't capture partial fronting or associations with specific headmates. Some of the simplicity is to avoid having to write much extra storyline content, because it's easier to extend the game overall when less is required per part. The current model supports:
- Co-fronting shyness and pushiness
- Fronting based on factors like memories and emotion
- What is shared and observed
- If presence is hidden, anonymous or known

## Accessibility
Accessibility is supported by following [WCAG](https://en.wikipedia.org/wiki/Web_Content_Accessibility_Guidelines) and WebAIM. Additional support beyond what WCAG requires is as below. The layout is minimalistic and centered for ease of reading and cencentration.

__Localization__  
Localizing Locket means a separate copy of story.md for every language, and keeping those synced is untenable. It's best to just fork this project if that's desired, or use browser translation tools which the author recommends instead.

__Browser support__  
Most modern browsers with javascript enabled should work with all features in Locket, with no additional permissions. We use caniuse.com and principles of graceful fallback to ensure support, and prefer to use only widely available browser features.

__Vision__  
Fonts support zooming, changing boldness, and spacing options. A tool for indicating the current line and/or paragraph is available in options. The first letter of every sentence can be separately styled to find the start of sentences more easily.
- For dyslexia, the font Arial is used when available and OpenDyslexic is an option
- For astigmatism, bright text on dark backgrounds are avoided
- For color blindness, reasonably high contrast is used by default and colors don't convey unique information
- Locket uses [APCA](https://git.apcacontrast.com/documentation/APCAeasyIntro.html) for color contrast suitability

Locket uses the 🛇 icon at the start of text for disabled controls, rather than reducing contrast.

__Navigation__  
Keyboard and screen reader navigation based on semantic HTML are used by default. The following are avoided due to navigation and motor function difficulties that they create, often even when used correctly:
- Right-clicking and multiple finger gestures
- Drag and drop when it's the most convenient method
- Time-sensitive interactions
- Tooltips, context menus and pop-ups
- Symbols and icons (due to lack of alt text)

All buttons are at least 64 pixels in their smallest dimension.

Locket maintains an exportable log of inputs and outputs in history, along with the most recent interaction being on-screen. It can be configured to keep all interactions visible. All interactions are recorded in history in such a way that the most recent action can be undone.

__Reminders__  
Locket can be configured to occasionally send a reminder text to the user at the start or end of the next response (such as after clicking a link). Examples include:
- To drink water or take medicine
- How long you have been playing and to take breaks

### 8. Cookies and local storage
Locket never collects user nor visit details nor makes a network call to transmit data of any kind. It stores game state information in local storage for the player's convenience, which can be disabled too.

### 9. Style and testing guidelines
Ideally, use the same code styles that appear in the document. 

Here is a set of instructions to do to test Locket:
1. Test with Narrator, NVDA, Talkback or VoiceOver
2. Use browser accessibility tools such as Axe
3. Test in Firefox and a chromium browser like Opera or Chrome
