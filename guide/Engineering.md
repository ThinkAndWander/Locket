# Engineering

This guide is just for programmers and anyone who is curious about how it works, not how to write text for it. See [Writing.md](https://github.com/ThinkAndWander/Locket/blob/main/guide/Writing.md) for that!

See License.txt for source code usage rights.

## Compiling
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

## Website structure

Only files in `website/` get bundled:
- use `website/index_debug.html` to test changes
- use `website/index.html` to see the minified app

These folders and files allow the site to be bookmarked in a special way that makes it open as if it was an OS app:
- `website/icons/` for most systems
- `website/splash/` for Apple splash screens
- `manifest.json` to describe how and which assets to use for PWAs

[Read about Progressive Web Apps (PWAs) here.](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

**Recreating the picture assets for PWAs**  
If you need to replace these, start with an SVG file because you'll neeed to rescale a lot for all the images. The current SVG is in `/assets/Locket.svg`. I created a large 512x512 drawing in a program like [Krita](https://krita.org/en/), pasted the resulting image into [Inkscape](https://inkscape.org/) to use Trace Bitmap, and moved the resulting SVG to [Graphite.art](https://graphite.art/) to set the Artboard size and center it on a 512x512 canvas. Then I used a [PWA icon generator site](https://www.pwa-icon-generator.com/) to get the assets to use. If you use this one, set the background color to `#3b82f6`. It will produce a .zip file and tell you how to use it.

> Note: the linked generator produces a .png for the favicon, but you may prefer [a favicon generator](https://favicon.io/favicon-converter/) instead. I prefer the icon file for its universal browser support.

**Styles and CSS structure**  
CSS is defined in styles.css only for statically known styles. Because stylesheets aren't reliably editable through code, both a `<style>` element and constructed stylesheet are added in theme.ts to achieve atomic removal and refresh of code-derived styles. This includes recolorable SVGs and styles associated to specific fonts, because these can't be applied with @font-face.

## Game model

Locket is a simple program. It uses a Markdown parser, which is extended to handle:
- [@ Fork names](https://github.com/ThinkAndWander/Locket/blob/main/guide/Writing.md#get-started)
- [@@ Fork descriptors](https://github.com/ThinkAndWander/Locket/blob/main/guide/Writing.md#all-fork-descriptors)
- [[fork links](@to_fork, descriptor1, ...)](https://github.com/ThinkAndWander/Locket/blob/main/guide/Writing.md#all-link-descriptors)
- [[sighted text](screen reader text)](https://github.com/ThinkAndWander/Locket/blob/main/guide/Writing.md#alting-text-for-screen-readers)
- [%placeholders](https://github.com/ThinkAndWander/Locket/blob/main/guide/Writing.md#placeholders) for pronouns
- `` `JS/HTML` `` that runs on fork load

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

## Design Principles
Efforts strive to follow [WCAG](https://en.wikipedia.org/wiki/Web_Content_Accessibility_Guidelines) and WebAIM to the highest standards they define, but as always, it's never perfect. Please open issues as they are found.

__Accessible by default__  
Locket supports:
- All accessibility standards
- All responsive app and PWA standards + full offline
- Browsers since 2021. Test with `@supports` and [caniuse.com](caniuse.com)
- Theme choice, filters and tinting, user CSS/JS
- Extensive typographic support
- Bundled fonts, including OpenDyslexic and Comfortaa
- Unique screen reader and place marking tools
- A reminder tool for pills, water, and so on

Locket stores explicit user preferences in localstorage. It collects no data and makes no network calls for resources that aren't a part of Locket itself, because the author is very tired of data extortion practices. (You can verify this in devtools by pressing F12 and go to Network and Storage tabs.)

__Player focuses__  
User preferences override the default presentation, because the experience revolves around the user, not the author.

Pronouns allow you to define yoursel(ves). Any character can be a system of headmates, and the player is allowed this at the start.

__Locket is not localized__  
Localizing Locket means a separate copy of story.md for every language, and keeping those synced is untenable. It's best to just fork this project if that's desired, or use browser translation tools which the author recommends instead.

__Motion__  
Motion is not explicitly used in Locket, both because it can annoy and disorient motion-sensitive individuals, and because it only impresses, but is not missed (author opinion). There are a few cases of motion, like when dragging theme filter sliders, in which previews are skipped according to `prefers-reduced-motion`.

__Fonts__  
Locket supports a reader-defined font, and comes with two bundled fonts: STIX Two, for its satisfying characteristics, and Open Dyslexic for ensured availability to dyslexic users. STIX Two is used as a default because it predictably satisfies:
1. fitness for novel-length reading
2. distinct rendering of `1` `I` and `l`

Browsers focus on matching look-and-feel of OSes, but common defaults often fail point 2 above, and most users don't care as long as it's legible (author opinion), so picking an accessible default makes sense.

Arial is slightly better when it satisfies point 2, which is possible with OTF settings that Locket uses. Windows, iOS and Android users will typically see it by default. (Helvetica and Neue Helvetica don't satisfy this.)

Locket defaults finally to a serif font because the serifs help distinguish text, which may help break it up (author opinion). There's an old myth that serifs are less accessible, but this derives from how thin lines display poorly on CRT monitors, making this a resolved issue.

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
Locket can be configured to occasionally remind the user of a custom message, like to take medicine, drink water, take a break or save and exit. The message appears at the top of the next response, such as after clicking a link.