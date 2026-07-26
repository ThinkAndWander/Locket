# Writing

This guide is just for writers, not how anything is designed. Or the game elements. [see the README](https://github.com/ThinkAndWander/Locket/blob/main/README.md) for that!

## Get started!

The story is written exclusively in English, in [markdown](https://www.markdownguide.org/basic-syntax/) along with:
- HTML tags, `<p>like this</p>`
- Editor comments, `<!-- like this -->`
- [Javascript](#javascript) `@@js like this @@`
- Alt text support like `made with [♥](love)`
- [Pronoun placeholders](#pronoun-placeholders) `%like this`
- And the fork syntax below!

**Files you care about**  
`story.md` contains the entire story.  
`characters.ts` contains all known characters.

**Fork syntax**  
Forks are a chunk of content with a name, basically. The game is a bunch of clickable links that jump to forks.

Here are two forks:

```
@ My fork
The reader can see this.

@ Another fork
Gaps between
words are
fine.
```

The game also cares about energy, time and characters, and we use <a href="#all-fork-descriptors">@@fork descriptors</a> to add that information.

```
@ My fork
@@ people River, Gerald-Kyra
@@ time 5 minutes

The reader can see this.
```

The user can click links to jump to named forks:

```
@ My fork
The reader can see this.

[Go on](@Another fork)
```

Links can have link descriptors, separated by commas:

```
[link with energy](@fork2, social 2)
```

That's the basics!

### All fork descriptors

`@@ people name1, name2, ...` Describes who is near and aware of each other, affecting mood and memories. Use system names to reference the whole character, or hyphenate the system and headmate like `Gerald-Kyra` to be specific.

`@@ time number unit` tells the game how much time passes by visiting this fork. It's how we simulate the passage of time! The unit can be `minutes` or `hours`.

`@@ trigger name1, name2, ...` Informs that the fork contains or may lead to [triggers](#coziness-and-triggers) (see link for names).

### All link descriptors

`social number` costs this much social energy to do.

`physical number` costs this much physical energy to do.

`mental number` costs this much mental energy to do.

### Placeholders

The player's plurality, gender and choice to be referred to only by name are all handled with pronoun placeholders, like:
`%they run%s away?`

The placeholders are based on `I` and `they` for familiarity and easier support, but the correct ones will be used.

**Player name**  
Because of plurality, all player name placeholders are written as having multiple names so that it's easier to perceive how they'll be injected into the story.
```js
"%(name, name)" // Mary, Bob, Sue
"%(name, and name)" // Mary, Bob and Sue
"%(name, or name)" // Mary, Bob or Sue
"%(name or name)" // Mary or Bob or Sue
"%(name and name)" // Mary and Bob and Sue
```

**Player referring to themself**  
`%I` `%me` `%my` `%myself` `%mine`  

**Player being referred to**  
`%they` `%them` `%their` `%theirs` `%themself`  

**Subject-matching words**  
`%I am` `%I was` `%I have` `%I'd` `%I'm` `%I've`  

`%they are` `%they were` `%they have` `%they're` `%they'd` `%they've`  
`%who are` `%who were` `%who have` `%who're` `%who'd` `%who've`

`%do` `%is`

**Subject-matching suffix**  
`%s` (e.g. "%they want%s")

Placeholders are written as though the player refers to themself with I and others refer to the player as they. They still turn into the preferred pronouns or player's name, considering plurality. Here are a few examples:
```json
// Placeholders are used in relation to player
%I want%s %my chance
%(name, and name)? %they would.
%they said so
What %do %they want
%I really %do.

// Examples in relation to others, or mixed player relation
%I think he's neat.
%(name, name) and Brenna? They are over there
%me and them? We're here!
%they'll see.
```

These objects can be accessed by custom user JS and CSS too, so that it's possible that the player can make extensions or modify the game.

Here's a full example.
````
@startingFork
`c.x = 4`
I just set a variable called x.
[Onwards!](nextFork)

@nextFork
The variable is: `c.x`
````
This will say that `x` is 4.

Write variables like `c.myvariable = 4`  
Display them like `c.myvariable` (it's that simple)  

> If it's all new stuff to you, just ask or look up the exact things you want to know. It's easier and less overwhelming, promise!

`@@ js code here @@` Creates a block of javascript that runs when the fork loads. It's multi-line, going until the nearest @@. You can access the game and player via `game` object, or the list of characters via `characters` array (see model.d.ts). Through that, most things can be done.

## Writing guidelines

Locket is a human story, do not use AI. It's a story for adults at high school and college reading level. It should feel cozy most of the time and be SFW!

**Setting**  
Locket is a fictional world. No IRL people, places or events. The player is a self-insert in their 20s-30s, in an apartment. Their family is alive and supportive. The player can be gender diverse and/or plural.

**What is and isn't okay**  
These create an unsafe space for players. Don't write on:
- Suicide, its ideation, self harm, or extreme depression
- Graphic violence or ongoing mental/physical abuse
- Substance abuse and addiction side effects
- Discrimination that is applied to someone
- Yelling, insulting, or belittling the player
- Don't imply the player's sex, gender, or body parts<sup>[1]</sup>

<sup>[1]</sup> The world pigeonholes people based on sex and body parts, then applies stereotypes. This is dysphoria-inducing. It's ok if the player identifies themself when it's a choice.

It's fine to have disagreement, arguing, disbelief and judgment with the player, or hold a bad belief that isn't discriminatory. Characters can be naive, wrong, can misremember and accuse, and say they don't like the player.

**Triggers**  
We can tag trigger warnings on fork links like this:  
`[text](@the fork, TW claustrophobia)`

Here are the taggable trigger warnings:
- `Body shaming` (judgment, categorical preference)
- `Claustrophobia` (tight corridors)
- `Arachnophobia` (spider, nest and web descriptions)
- `Dysphoria` (melancholy about one's image or body)
- `Violence` (harm, gore, dead stuff, confrontation)
- `Lifestyle assumptions` (no intolerance of player)
- `Homelessness` (hardship and crushing poverty)

**Player choices**  
Choices presented to the player should be satisfying and feel like the player, since they're a character insert. Try not to write choices with the exact same side effects. It's ok to be linear sometimes, but don't box a player into a certain way of speech or action. Offer outs to return from long sequences, or from possibly uncomfortable situations.

**Learning about people**  
Memories track things like whether the player knows a person's name(s) and plurality. Sometimes if there are cues, such as a strong system switch or behaviors created around that status by the culture experiencing it, the player can be given an option to ask. Never should it be assumed or prescribed, and be careful to avoid harmful stereotypes.

**Evolving vs. self-representing**  
The player should take preference in self-representation. Reactions should form from player decisions, and the personality model can affect outcomes of player choices or reveal _extra_ choices, but not remove major choices.

## Alting text for screen readers
Locket supports screen readers and Braille readers by default, and this means (1) using semantic HTML and aria-live, and (2) separating content that's purely visual from the content that should be read aloud.

A screen reader, for example, should not read all these \~\~\~decorative\~\~\~ markings around the word *decorative*. Even if it does, it conveys little information. Keep in mind that there is a lot of nuance in determining what information to present, because you don't want to ever give more _or_ less info than a sighted user has.

In most cases, it's best to just leave text alone. But for the sake of separating presentation text, Locket supports alting text with the following syntax:

```
[sighted text](screen reader text)
```

This exists because [screen reader support can be rough](https://www.elevenways.be/en/articles/screenreaders-special-characters), and most readers are stuck choosing between speed and clarity. Note that this feature can be turned off for users bothered by it.

Most readers allow adjusting pitch, speed, or injecting words like "cap" (for capitals) to improve verbal reading, but the settings are often simple.

> 💡 Opt-in auto-replacement tables for screen reading are being explored.

Note: do *not* use `[alting](text)` to attempt to improve how readers speak the text. They will pronounce it differently, it will affect the transcript and per-character scanning, and lead to a poor Braille experience.

The more presentation lends to the text, the more likely that alting text will improve it. In this example:
```
And then
            BOOM.
```
The words "then" and "BOOM" will be read without pausing for emphasis, so we can inject a colon for screen readers, like this:
```
[And then](And then:)
            BOOM.
```

The internet has no feature detection or hinting for what screen readers can or should do. Hopefully one day this will change. As an example of how bad it can be, and what to avoid, here's a list of situations to watch out for:
- Exclamatory words, yeowch!
- Exclamations in general
- Repetitive exclamation and question marks!?!
- Visual emphasis, such as a different color
- Dashes for asides — pauses — or interruptions
- Parenthetical choice(s) (and asides)
- Unstated PoV change as in `"Yes." Liar.`
- Quotes for dialog, skepticism, or citation
- Streeetching, s p a c i n g and st-stuttering
- ALL CAPS and sArCasTiC cAps
- Caps for emphasis like `cast The Spell` vs. `cast the spell`
- cut-off words like `Hotdog and mustar-`
- Trailing and leading ellipses
- Fast speech like `Isurelovecaffeine`
- Meaningful typos like `Hai!` (purposefully cute)
- Acronyms that might get read like words
- Visual decorations `⊹₊Rainbow₊⊹ wav3`
- Meaningful emojis `Explode ✨` (sarcastic)
- Emojis as words `☕? Spill.`
- Big numbers (use commas as a group separator)
- Number separations `9 1 1 in 1985. 9/11` should read like `9-1-1 in nineteen eighty-five. 9 11`

There's no need to do anything about:
- intentional typos
- slashes such as `and/or`
- ellipses in the middle of sentences `like…this`

**Problematic styling and characters**  
For the best experience for all users:
- Avoid emojis and 𝑓𝑎𝑛𝑐𝑦 unicode. It won't work everywhere. The big social medias use emoji/COLv1 fonts to solve this, so you could try that
- Avoid sArCaSm and ~~striking~~. It reduces legibility
- Don't <u>underline</u>. It looks like a link

## Programming API
Story code can execute as HTML or Javascript. User custom JS can also execute with access to the API, but it won't execute as HTML because there is no clear place to inject it.

`` `code` `` will execute if it can, as either:
- HTML if it starts with `<` and is story code
- Javascript otherwise, and it's:
  - Multi-line for \`\`\` code blocks \`\`\` or if it has an `=` sign
  - Single-line otherwise. These add their result to the screen, if it's not `undefined` or `null`.

The API is simple full access, but **has no guarantee** that code written will not break later unless it's part of the `c` object.

**API Members**
`c`: Stands for context. This Javascript object is the only safe place to put variables, and a dedicated place to share variables between scripts. If you want to keep variables, define them here so they get saved!

`game`: Provides access to the game and app options, to the entire story, the error log and the player object. It's defined in `model.d.ts`, or you can use intellisense in the browser to understand it.

`characters`: Provides access to all known non-player characters in the game. It's defined in `model.d.ts`, but most of it is in `characters.ts`. Intellisense helps here too.

There are just three special code things added by Locket:
- `c`, which is a really short abbreviation of "context", because you'll use it a lot. It's a JS object and whatever is set on it can be used between scripts and will be saveable.
- `game`, which lets you change most things
- `characters`, which has every character

**Dependable HTML IDs**  
To ensure that extensions of Javascript (or user CSS!) can reliably reference the HTML, these following HTML IDs are guaranteed not to change unless the element (and concept) are removed from the game:
- `overlay`: Covers the whole page and is used for theme tint
- `leftGutter`, `rightGutter`: The gutters used to tint the sides
- `page`: The center portion which contains all but the gutters
- `headerBar`: Contains the header
- `headerSettings`: The button that activates Preferences page
- `mainColumn`: The reading column and input textbox
- `outputArea`: Contents of the reading column
- `inputArea`: The input textbox element
- `preferences`: The Preferences page
- `prefsFilterHue`, `prefsFilterHueNum`: Filter slider & spinner
- `prefsFilterSaturation`, `prefsFilterSaturationNum`: Filter slider & spinner
- `prefsFilterBrightness`, `prefsFilterBrightnessNum`: Filter slider & spinner
- `prefsCustomFilter`: textarea element whose contents get appended to a `filter:` css style on body element
- `prefsTint`: The tint input element whose value is a color (in *any* format). Opacity is ignored.
- `prefsTintOpacity`, `prefsTintOpacityNum`: Tint slider & spinner
- `prefsTintMethod`: Sets mix-blend-mode on the overlay element
- `prefsCustomCSS`, `prefsCustomJS`: the textarea elements for user CSS/JS, in case they want to send JS to the CSS textarea