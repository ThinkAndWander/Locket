# Writing

This guide is just for writers, not how anything is designed. Or the game elements. See the README for that!

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

`@@ js code here @@` Creates a block of javascript that runs when the fork loads. It's multi-line, going until the nearest @@. You can access the game and player via `game` object, or the list of characters via `characters` array (see model.d.ts). Through that, most things can be done.

### All link descriptors

`social number` costs this much social energy to do.

`physical number` costs this much physical energy to do.

`mental number` costs this much mental energy to do.

### Placeholders

The player's plurality, gender and choice to be referred to only by name are all handled with pronoun placeholders, like:
`%they run%s away?`

The placeholders are based on `I` and `they` for familiarity and easier support, but the correct ones will be used.

**Player name**  
To get the player name(s), use `%name`. You may need to consider potential plurality in grammar usage, here.
```js
%name or me // Mary or Bob or me
(%name) or me // (Mary or Bob) or me
%name, or me // Mary or Bob, or me
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
`%s` (e.g. "they want%s")

Placeholders are written as though the player refers to themself with I and others refer to the player as they. They still turn into the preferred pronouns or player's name, considering plurality. Here are a few examples:
```json
// Placeholders are used in relation to player
%I want%s %my chance
%name? %they would.
%they said so
What %do %they want
%I really %do.

// Examples in relation to others, or mixed player relation
%I think he's neat.
%name and Brenna? They are over there
%me and them? We're here!
%they'll see.
```

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

## Supporting screen readers
Text-to-speech (screen reader) support is essential. Use punctuation precisely, except by providing screen reader text in this format:
```
[sighted text](screen reader text)
```

[Support varies](https://www.elevenways.be/en/articles/screenreaders-special-characters), and excess spaces, capitals, dashes, quotes, [question marks and exclamations are often omitted](https://www.stefanjudis.com/today-i-learned/em-and-strong-are-not-be-announced-by-screen-readers/). These tables cover pitfalls and solutions for typical and informal writing. Note the user can turn off the extra screen reader support.

| **Situation**          | **Correct but unfriendly**         | **Screen reader friendly**                                                           |
|------------------------|------------------------------------|--------------------------------------------------------------------------------------|
| Long dash to pause     | they — completely — failed         | They. Completely. Failed.                                                            |
| Asides                 | this (or this [or that])           | this, or this, or that                                                               |
| Exclamations           | What! How strange                  | What exclamation mark. How strange                                                   |
| Emphasis               | *They* are **soon** coming.        | They, are, soon, coming.<br/> They italicized, are, soon bolded, coming.             |
| Plural choice          | Person(s) and charge(s)            | Persons and charges<br/> Person or persons and charges                               |
| Acronyms               | PEMDAS education needs TLC         | Pemdass education needs T L C                                                        |
| No space between tags  | `<p>Hi</p><p>Ok?</p>`              | `<p>Hi<br/></p><p>Ok?</p>`<br/> `<p>Hi</p>&nbsp;<p>Ok?</p>`<br/> `<p>Hi. Ok?</p>`    |
| Censoring              | This **** jerk                     | This bleep jerk<br/> This censored, jerk                                             |
| Missing word           | ___ is the best                    | Blank is the best                                                                    |
| Unstated speaker change| "Yes." I thought so                | "Yes," they said. I thought so                                                       |
| Critical quotation     | It's "good" for 'humans'           | It's quote good quote for quote humans quote                                         |
| Rhetoricals            | I thought it wasn't?               | I thought it wasn't question mark                                                    |
| Unclear voice          | They paused. "Why?" You're unsure. | They paused and asked why? You're unsure.                                            |

| **Situation**        | **Unfriendly**       | **Screen reader friendly**                |
|----------------------|---------------------:|-------------------------------------------|
| Stretching words     | Streeetch            | Stree-etch<br/> Streh-eh-eh-etch          |
| Spacing words        | s p a c e words      | spuh, ace. words<br/> S P A C E words     |
| All caps             | WHAT IS IT, they ask | All caps what is it, they ask             |
| Caps emphasis        | cast The Spell       | Cast the capital S pell                   |
| Cut off words        | Hotdog and mustar- oh.| Hotdog and muster- oh.                   |
| Ellipses at ends     | ...I don't know...   | dot dot dot I don't know dot dot dot      |
| Fast speech          | IlovecaffeineyesIdo  | I love caffeine yes I do                  |
| Meaningful typos     | Hai! Prns?           | H A I! Pronouns?                          |
| text acronyms        | woah fr? ok. ttyl    | Woah F R? Ok. T T Y L                     |
| Visual decoration    | ⊹₊Rainbow₊⊹ wav3    | Rainbow wave                              |
| Meaningful emojis    | Hi :3 Burn ✨       | Hi, colon 3. Burn, sparkles emoji         |
| Emojis as words      | The ☕ is 🦊ed up   | The tea, emoji, is foxed up, emoji        |
| Lingual shorthands   | 2 * 6, 5'2", 3µ      | 2 times 6, 5 foot 2, 3 microns            |
| Literal characters   | code_run();          | code underscore run parentheses semicolon |
| A big number         | 35623521             | 35,623,521                                |

Writing is at discretion. Try to keep and not add any meaning sighted users don't have.

You can freely do these without it:
- verbally clear typos `liek this`
- obvious questions `what is it?`
- capitals emphasis `they Know`
- using a slash between options like `and/or`
- cutting off words, as in `"Wha...?"` and `"Ok, but—`
- using ellipses to start/end as in `"…are you sure?"`
- onomatopeias, `yeowch!`

You still can't use it for:
- Emojis and 𝑓𝑎𝑛𝑐𝑦 unicode. It may not display
- sArCasM and ~~strikethrough~~. It's illegible
- <u>underline</u>. It's confusable for links