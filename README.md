# Locket

A cozy slice-of-life adventure where you live and discover your own adventures and friends along the way 💛

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

## Writing format

The story is in a superset of [markdown](https://www.markdownguide.org/basic-syntax/). It supports all HTML tags `<p>like this</p>` including comments `<!-- like this -->` and in-line javascript in `` `${this syntax}` ``. Nothing will be localized to another language explicitly because of dynamic sentence structuring and that most of this game is text. Browser auto-translation may help here.

The Markdown link syntax usually requires a website in the link portion of `[text](link)`. This is specially extended here, like this:
- `[text](@link)` Goes to a fork called link
- `[text](alt)` Shows `text` visually and only `alt` to screen readers, such as `Made with [♥](love)`

### Forks
Start by naming a fork anywhere and everything below that is part of it. Like this:

```
@ My fork
the reader can see any normal text up to the end of this fork

@ Another fork
Everything here is part of *this* fork
```

Use `[display text](@fork, options)` for story links:

```
[simple link](@fork to link to)
[link with triggers](@next fork, TW violence)
```

The following fork options exist:
- `TW name` like TW claustrophobia. TWs show near their associated link, and spoiler the link if the player hides it. These are detailed [in triggers](#coziness-and-triggers):
  - `body shaming`
  - `claustrophobia`
  - `arachnophobia`
  - `dysphoria`
  - `violence`
  - `lifestyle assumption`
  - `homeless hardship`

### Pronoun placeholders

Placeholders are used to refer in reference to the player's gender. While characters in the game can use any pronouns too, they're predictable by us who wrote them and so we only need player pronoun placeholders. Write them in-line.

When the player describes themsel(ves)  
`%I` `%me` `%my` `%myself` `%mine`  

When someone describes the player  
`%they` `%them` `%their` `%theirs` `%themself`  

Subject-matching words  
`%I am` `%I was` `%I have` `%I'd` `%I'm` `%I've`  

`%they are` `%they were` `%they have` `%they're` `%they'd` `%they've` `%who are` `%who were` `%who have` `%who're` `%who'd` `%who've`

Subject-matching suffix `%s` (e.g. "they want%s")

Placeholders are written as though the player refers to themself with I and others refer to the player as they. They still turn into the preferred pronouns or player's name, considering plurality.

## Writing guidelines

Locket is a human story, not a product to package and sell. Do not use AI.

### Coziness and triggers

Keep it cozy until the player chooses something that isn't. When this happens, write options to quickly return to coziness (if possible), or an option to finish the interaction if not. Uncozy scenarios often have triggers, so tag them and avoid unnecessary inclusion of:
- Body shaming (judgment, categorical preference)
- Claustrophobia (tight corridors)
- Arachnophobia. (spider, nest and web descriptions)
- Dysphoria (melancholy about one's image or body)
- Violence (harm, guts/blood, dead stuff, confrontation)
- Lifestyle assumptions (intolerance of player is banned)
- Homelessness (hardship and crushing poverty)

These are too extreme for Locket. Don't write about:
- Suicide, its ideation, self harm, or extreme depression
- Graphic violence or ongoing mental/physical abuse
- Substance abuse and addiction side effects
- Discrimination, even when not aimed at the player
- Direct conflict aimed at the player (yelling, insults)

Characters can disagree, argue, be in disbelief or judge things the player says. They can be wrong, misremember, accuse, and say they don't like the player. But they shouldn't pass a judgement about the player or yell at them.

### Assumptions

The main character is a player insert, who can define:
- Preferences on body representation / attraction
- Preferences on pronouns, names, gendered language
- Headmates

Gender and body information is divorced from assumptions about what they mean. This de-emphasizes distinction of sex from gender on purpose. As such:
- Pronouns should not imply gender or sex
- Gendered choices should not imply sex
- Body attraction preference does not imply body parts
- Do not refer to the player with body features
- Do not imply the player has certain gendered body parts

For coziness and ease of writing:
- The player is a young adult in an apartment
- The player's family is alive and supportive
- Economy and politics are not bad or good
- Don't reference IRL people, places, events, etc.
- Don't associate strongly to any culture

## Addendums


### 1. Why pronouns instead of name?

Because pronouns are part of gender affirmation, and part of plurality recognition. This requires placeholders in the writing, but it helps the player feel represented, and that is very important.

### 2. Sex, gender and preference

In short, the player decides how to be treated, explicitly, rather than assuming how to treat them based on gender or sex.

Gender is how a person identifies themself, in relation to concepts like sex, which is a spectrum of physical attributes that largely has no effect in social interactions beyond applied symbology and hormones. Hormones demonstrably occur in any concentration, for any type(s), for any of the perceived sexes. It happens that most people fall towards two areas of the spectrum.

Hormones can cause slight behavioral leans that create a falsely binary division of behavior that society attaches much symbolic associations to. As a result, we have heaps of cultural symbols such as gendered colors and clothes, and little intersex awareness. To expect, assume or force an individual to match stereotypes about sex is called bioessentialism and is a defunct but popular concept.

Bioessentialism attempts to invalidate a person's gender by suggesting their real nature is the cultural symbols attached to their perceived sex. This is so prevalent that even referring to gendered body parts correctly feels invalidating and may cause dysphoria, especially since the player is a self-insert. As a result, Locket avoids describing sexes.

A similar pigeonholing occurs with behaviors and things gendered as feminine or masculine. In those cases, it's best to avoid defining under those terms, and to allow the player to present actions in a gender-neutral way, and to follow their gendered language preference.

### 3. Handling learning about a person
Memories track things like whether the player knows a person's name(s) and plurality. Sometimes if there are cues, such as a strong system switch or behaviors created around that status by the culture experiencing it, the player can be given an option to ask. Never should it be assumed or prescribed, and be careful to avoid harmful stereotypes.

### 4. Evolving personality vs. self-representation
The player should take preference in self-representation. Reactions should form from player decisions, and the personality model can affect outcomes of player choices or reveal _extra_ choices, but not remove major choices.

### 5. Architecture of persons in Locket
In Locket, everyone is represented as a system of 1+ headmates; most are singlets. Headmates have the following:
- Variables, like stats, attributes and skills
- Current emotions and energy for things
- Memories for long-term associations
- Reactions to create evolving personalities

All headmates may define how they interact in a system, although it doesn't capture partial fronting or associations with specific headmates. Some of the simplicity is to avoid having to write much extra storyline content, because it's easier to extend the game overall when less is required per part. The current model supports:
- Co-fronting shyness and pushiness
- Fronting based on factors like memories and emotion
- What is shared and observed
- If presence is hidden, anonymous or known

### 6. Architecture of stories in Locket
These files are important for story writers:
- `story.md`: The main story itself
- `story/characters.ts`: All character definitions
- `story/branching.ts`: Helps randomize day events

The story can use information defined elsewhere in the program to help randomize. Defining characters in a separate file helps with consistent reuse and enables memories to work better, while branching can be fine-tuned in the branching section.

### 7. Architecture based around accessibility
Accessibility is supported by following [WCAG](https://en.wikipedia.org/wiki/Web_Content_Accessibility_Guidelines) and WebAIM. Additional support beyond what WCAG requires is as below. The layout is minimalistic and centered for ease of reading and cencentration.

__Accessible language__  
Locket keeps text legible by using highly accessible fonts and avoiding patterns that complicate or impair usage. Fonts that can't distinguish `1lI` are excluded.

Because Locket is a game targeting a teen and adult audience, a sophisticated reading level is allowed. Pointlessly flowery language, such as this, which over-explains itself and perhaps uses additional words beyond what is necessary, should be avoided. Try to match the existing writing style if possible.

All of these create screen reader issues or aren't accessible across all devices.

Don't:
- `streeeeetch`, `s p a c e` or `YELL` words
- `inventorate` new words
- `mashwordstoindicatefastspeech`
- `⊹₊ decorate ₊⊹` with unicode
- use unicode styles like `ᴛʜɪs` or `𝕥𝕙𝕚𝕤`
- use typos or text markup like `*this*`
- add arbitrary `E`mphasis by using capital letters
- omit periods in acronyms like `THIS`
- ~~strikethrough~~ and <u>underline</u>
- redundant or incorrect grammar like `what???`

Do:
- using a slash between options like `and/or`
- use distinct diction and grammar for expression
- using acronyms like `T.H.I.S.`, but not like `THIS` 
- using highly known acronyms like `lol` and `etc.`
- cutting off words, as in `"Wha...?"` and `"Ok, but—`
- very simple math notation, such as `2x6` or `2 * 6`
- using ellipses to start/end as in `"…are you sure?"`

We use the ellipsis character for better reading support, and the en- and em- dashes instead of writing multiple hyphens in a row. Don't use the interrobang.

Onomatopeias and exclamatory remarks are ok. `Streeeetching` and `s p a c i n g` words is not.

Don't use underlines for styling, because it conflicts with how interactive elements look.

- ⊹₊ Pretty ⊹₊ design relying on unicode
- Emojis like 🔭 and symbols with semantic meaning
- USING CAPITALS TO CONVEY SHOUTING (capitalization status is not clear to sighted users)
- Streeeetching out words
- Texting patterns like *this\* when

__Localization__  
Most of Locket is textual description, which makes localizing a significant effort. It's complicated by how phrases are combined to form sentences, which is difficult for sentence restructuring. For example, pronoun injection.

It would be possible to localize Locket. To do so would require reading the browser language, determining the nearest supported locale and falling back on English. The user would be able to pick their language and it would be remembered. Strings outside of story.md would move to a separate file and borrow from it.

__Browser support__  
Most modern browsers with javascript enabled should work with all features in Locket, with no additional permissions. We use caniuse.com and principles of graceful fallback to ensure support, and prefer to use only widely available browser features.

__Vision__  
Fonts support zooming, changing boldness, and spacing options. A tool for indicating the current line and/or paragraph is available in options. The first letter of every sentence can be separately styled to find the start of sentences more easily.
- For dyslexia, the font Arial is used when available and OpenDyslexic is an option
- For astigmatism, bright text on dark backgrounds are avoided
- For color blindness, reasonably high contrast is used by default and colors don't convey unique information
- Locket uses [APCA](https://git.apcacontrast.com/documentation/APCAeasyIntro.html) for color contrast suitability

Locket uses the visual-only 🛇 icon at the start of text for disabled controls rather than reducing contrast.

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
