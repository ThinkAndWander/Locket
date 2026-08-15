# About: Preferences

Locket comes with an abundance of preferences for reading choice and pleasure. What these are is covered in detail here.

All preferences are saved automatically, meaning as soon as they change.

## View and typography

Basic zooming, and choices about text styling.

**Zoom**: Scales everything but reading column width, so it's easier to see. It aims for 150% on desktop, and 80-120% on mobile, depending on how narrow the screen is. Changes will update after applying or leaving settings, to avoid a jarring experience.

**Font**: The reading font can be chosen from either a dropdown of built-in fonts, or by typing a font by name. Open Dyslexic and Lexend are built-in for dyslexia-friendly reading on any device ("Open Dyslexic Condensed", which is the Open Dyslexic font with a strong letter-spacing applied). Some suggestions are given for typed-in fonts, but you can type in any font name and it will load if installed on your device. STIX Two is used if it doesn't work.

> Note: Browsers can't tell if a font works or not! This helps prevent [browser fingerprinting](https://en.wikipedia.org/wiki/Device_fingerprint).

**Font bolding**: You can make all reading text bold with this option. Some variable fonts like _Noto Serif_ can display thinner, thicker and in-between levels.

**Reading column width**: Adjust the width of the area that all reading text and interactive content appears in.

**Paragraph spacing, Line spacing, Word spacing, Letter spacing**: The spacing of the reading area can be adjusted in four aspects; the vertical distance between paragraphs and lines, and the horizontal distance between words and letters.

> Note: Open Dyslexic Dense overrides letter spacing while used.

## Accessibility

**Use icons for disabled controls?**: Normally, disabled controls are grayed out. This can be hard to see. This option uses 🛇 (a circle connected by a diagonal line) to indicate this.

**Paragraph marking**: The start of paragraphs can be marked in different ways with emphasis styles and alternate colors. Most affect either the first letter, or the first line of text:
- `Alternating background`: Sets background color of every other paragraph
- `Alternating indent`: indents every other paragraph
- `Bold 1st letter/line`: Bolds
- `Highlight 1st letter/line`: Sets background color to an accent color
- `Underline 1st letter/line`: Underlines in an accent color
- `Color 1st letter/line`: Colors with an accent color
- `Big 1st letter/line`: Makes the text larger, even moreso for first letter

**Paragraph border**: Draws a border around all paragraphs, either thin or thick. It can also be limited to hovering over a paragraph instead of affecting every paragraph.

### Reading Focus

Reading focuses help isolate or reduce stimuli while reading. Try these with other accessibility features as well.

**Highlight**: This option works for mouse users because it requires hovering. The `Behavior` option allows you to pick whether to highlight the side of the text, or the whole paragraph when hovered. When highlighting the side of the text, the `Size` option lets you switch between a thin or thick bar.

**Ruler**: This option establishes a bar over text that is used to focus on just that text. `Color inside` gives the bar a color, so that the user can focus on just the text inside of it. `Color outside` instead tints the rest of the reading area. `Size` is how many lines of text tall the reading ruler is. `Ruler controls` lets you decide how the bar moves.

The `Focus color` is the color of the sidebar highlight or paragraph background highlight, and `Opacity` is the strength of the effect.

## Theme

You can choose from some presets, and use filters to further customize. (When it's not enough, see the "code customization" section, or log an issue for specific problems.)

**Theme**: There are many themes to pick from, including low contrast themes for visual relief. By default, a theme is chosen (high or low contrast in dark or light mode, or system) based on browser preferences. There are four levels of relief in both light and dark mode: low contrast, normal, high contrast, and stark (like white on black). There are simple dark and light modes that color fewer things, and then several fancier themes each of which uniquely do something.

**Contrast, Brightness, Saturation and Hue**: These sliders color the entire screen by adjusting the contrast of all colors to each other, their brightness, how intense colors are, and the colors themself. Adjusting hue actually also applies a sepia effect so that everything will be monocolored when in use.

**Theme filter**: Applies a [CSS filter as covered in MDN documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/filter#syntax), similar to what the sliders do, but with full control. This is an advanced feature. Anything set here will totally override the sliders until removed.

**Theme tint**: Theme filter options aren't good at infusing a specific color, but the tint is. It's an overlay that's drawn according to the `Tint method` (a blend mode), with a strength defined by `Tint intensity`, in the chosen `Tint color`.

## Code customization

This advanced feature gives readers total control of their experience, but requires an understanding of CSS or Javascript. `Custom CSS` applies with anything that refreshes the theme, and `Custom Javascript` waits for a full page refresh. All Javascript runs after the page is guaranteed ready, and the page structure in Locket is guaranteed to exist. If it fails, it will try to catch errors and comment itself out. Be careful! This isn't guaranteed, and it's possible to ruin the experience with custom CSS and JS to the point of needing a reset. If you have this problem, look up how to clear local storage for a website in your browser. See the [programming API in Cookbook.md](https://github.com/ThinkAndWander/Locket/blob/main/guide/Cookbook.md#programming-api).

## Miscellaneous

**Allow story code?** Whether Javascript written by the author should execute at all. Keeping it off is safe if you don't trust or don't know the story.