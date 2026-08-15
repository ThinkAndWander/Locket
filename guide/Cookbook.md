# Cookbook

This guide is for writers interested in adding programming bits to their game! It also serves as a reference. For non-programming authorship, [see Writing.md](https://github.com/ThinkAndWander/Locket/blob/main/guide/Writing.md).

## Q & A

### How do I record things in the story?
You need code, which you can type in backticks like `` `this` `` or like
````
```
this, for multiple
lines.
```
````

Write `` `c.myVariable = 5` ``, or other values you want to set it to. You can name `myVariable` anything as long as it starts with a letter or underscore. Each following line is an example:
```js
`c.numberInLine = 1`
`c.plant = "lavendar"`
`c.manyThings = ["this", "has", 4, "values"]`
```

And you can access these like:
```js
`c.numberInLine`
`c.plant`
`c.manyThings` /* this is the collection of stuff */
`c.manyThings[0]` /* first item in the collection */
```

When you type it in-line in the story, like `` `c.plant` ``, it will put its value on the screen. If you set a value or if it can't find the one you mentioned, it won't affect the screen.

The `c` in front of every line of code stands for "context". Data in `c` is visible to every part of the story.

### How do I ask the player their name?
You'll need both HTML and Javascript, but don't worry, you can copy and edit! Type HTML anywhere and Javascript in `` `code` ``.

Use this HTML and Javascript:  
```html
<input id="nameGoesHere" type="text">
```

```js
game.story.callbacks.afterLoad.push(() => {
  const myElement = document.getElementById("nameGoesHere")
  myElement.addEventListener("input", () => {
    c.playerName = myElement.value // Do anything you want!
  })
})
```

This uses `afterLoad` to wait until the HTML is ready so we can find the loaded `myElement` input. Then it adds an input event that runs whenever the text in `myElement` changes. That code snippet says to record the new value into `c.playerName`.

Look up [web beginner tutorials](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core) to learn more!

### How do I make fork links from code?
Use HTML to make a button with the `data-fork` attribute set to the exact name of your fork, but in lowercase:

```html
<button data-fork="fork here">Text</button>
```

## Programming API
Story code will execute as Javascript if it's in a code block. Custom JS can also execute with access to the API, but it won't execute as HTML because there is no clear place to inject it. To debug code, write `debugger;` on its own line, and as long as you have your browser's dev tools open, it will pause and go right to the code so you can step through it.

Code executes as multi-line for \`\`\` code blocks \`\`\` or if it has an `=` sign. Otherwise, it executes as single line, which will automatically add string results to the screen. Multi-line code can do this too, but it has to type `return` first. (In technical terms: single lines eval() and print their result to the screen, while multi-line supports multiple statements and requires explicit returns to print to screen.)

The API is simple full access, but **has no guarantee** that code written will not break later unless it's part of the `c` object.

#### API Members
`c`: Stands for context. This Javascript object is the only safe place to put variables, and a dedicated place to share variables between scripts. If you want to keep variables, define them here so they get saved!

`game`: Provides access to the game and app options, to the entire story, the error log and the player object. It's defined in `model.d.ts`, or you can use intellisense in the browser to understand it.

`characters`: Provides access to all known non-player characters in the game. It's defined in `model.d.ts`, but most of it is in `characters.ts`. Intellisense helps here too.

There are just three special code things added by Locket:
- `c`, which is a really short abbreviation of "context", because you'll use it a lot. It's a JS object and whatever is set on it can be used between scripts and will be saveable.
- `game`, which lets you change most things
- `characters`, which has every character
- `api`, see the "Dependable API Members" section

#### Dependable API Members
The `api` object contains the following objects or functions that are guaranteed to exist, although their contents may update unless specified otherwise:
- `marked`: The underlying Marked.js reference, which is the technology used to turn the Markdown format into text. This reference includes all extensions made by Locket itself. Of interest is `marked.parseInline(str)` to add output to the screen from Javascript that's formatted in Markdown.
- `version`: A value that increments for each public change to the engine, starting at 0. It does not reset across major versions.
- `selfPronouns`: An object with singular or plural first-person pronouns; see "selfPronouns" in consts.ts
- `pronouns`: An object with many third-person pronoun sets, see `pronouns` in consts.ts
- `subjectMatch`: An object with words that change according to pronoun usage, see `subjectMatch` in consts.ts
- `jumpToFork`: A function that jumps to the given fork object.
- `pronounify`: A function that takes ___ and returns the placeholder-injected string. See `injectPronouns` in placeholders.ts,
  - signature `(headmate: headmate, str: string, soloFronting?: boolean): string`
- `getName`: Returns the name of a given headmate object, respecting plurality preferences. See `listNames` in placeholders.ts
  - signature `(headmates: headmate[], format: listNameFormat): string`
- `getNames`: Returns one string containing the names of all the given headmates. See `getName` in placeholders.ts
  - signature `(headmate: headmate): string`

#### Dependable HTML IDs  
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

#### Dependable CSS Variables
While most values are accessible from Javascript, it's a lot simpler and clean to give access through CSS. This helps especially with respecting user choices. This includes:
- `--fallback-fonts`: Value is `"STIX Two", "Noto Serif", serif;` and this doesn't change. Use it when you wish to set the font-family, so that you don't wipe out fallbacks.
- `--api-pref-zoom`: Value is a number as a string, from 0.8 to 4.0. Defaults are 1, 1.2, and 1.5 depending on screen size.
- `--api-pref-font`: Value is the user's current font, including write-ins. If none is set, this is an empty string. Ideally, the user font choice should never be overridden.
- `--api-pref-font-weight`: Value is the user's baseline font weight, default 400. Font weights go from 100 to 950; keep in mind that most fonts fallback to 400 or 600 (regular or bold) because they can't display other weights. Only variable fonts can do that, and the supported range depends on the font. Try [Font Info.app](https://fontinfo.app/) to determine what range your font supports, or your browser's dev tools for fonts.
- `--api-pref-spacing-paragraph`: The vertical margin between paragraphs is `1rem` by default and ranges -0.75rem - 3rem.
- `--api-pref-spacing-line`: This is line height and is `1rem` by default. It ranges 1rem to 3rem.
- `--api-pref-spacing-word`: Word spacing is `0` by default and ranges -0.05rem to 0.5rem.
- `--api-pref-spacing-letter`: Letter spacing is `0` by default and ranges -0.0375rem to 0.1rem.
- `--api-pref-show-disabled-status`: `false` by default, but can be `true`. When true, controls will add the unicode No symbol instead of graying out.

#### Dependable CSS Names
A small collection of useful classes that will not change.

- `.clearfix`: Use on the container of a floated element to ensure content goes beneath it properly.
- `.sr-only`: Hides content off-screen, but leaves it accessible to screen readers. Use this only to provide an alternative read-out to screen readers for text, since aria-label doesn't work with text. The shown text should have `aria-hidden=true`. This is used by the text alting syntax. Almost any other use is bad for accessibility.