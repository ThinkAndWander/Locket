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

The story is in a superset of [markdown](https://www.markdownguide.org/basic-syntax/). It supports all HTML tags like `<p>this</p>` including comments `<!-- like this -->` and in-line javascript using `` `${this syntax}` ``.

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
- `TW name` like TW claustrophobia. This is a trigger warning that shows near the link indicating that it contains a potential upset. All TWs are displayed, but players can disable the named ones so the choice won't appear:

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

Don't use AI.

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

Gender and body information is divorced from assumptions about what they mean, for wide gender support. Note:
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